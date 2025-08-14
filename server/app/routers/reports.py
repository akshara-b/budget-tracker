from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from motor.motor_asyncio import AsyncIOMotorClient
from ..db import get_database
from ..routers.auth import get_current_user
import pandas as pd
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
import io
import base64

router = APIRouter()

# Models
class SpendingByCategory(BaseModel):
    category: str
    total_amount: float
    transaction_count: int
    percentage: float

class MonthlyTrend(BaseModel):
    month: str
    income: float
    expenses: float
    net: float

class FinancialSummary(BaseModel):
    total_income: float
    total_expenses: float
    net_amount: float
    savings_rate: float
    top_spending_categories: List[SpendingByCategory]
    monthly_trends: List[MonthlyTrend]

# Routes
@router.get("/summary", response_model=FinancialSummary)
async def get_financial_summary(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database)
):
    # Set default date range to last 12 months if not specified
    if not start_date:
        start_date = datetime.utcnow() - timedelta(days=365)
    if not end_date:
        end_date = datetime.utcnow()
    
    # Get transactions in date range
    pipeline = [
        {"$match": {
            "user_id": str(current_user["_id"]),
            "date": {"$gte": start_date, "$lte": end_date}
        }},
        {"$group": {
            "_id": "$transaction_type",
            "total": {"$sum": "$amount"},
            "count": {"$sum": 1}
        }}
    ]
    
    transaction_summary = await db.transactions.aggregate(pipeline).to_list(None)
    
    income = next((item["total"] for item in transaction_summary if item["_id"] == "income"), 0)
    expenses = next((item["total"] for item in transaction_summary if item["_id"] == "expense"), 0)
    net_amount = income - expenses
    savings_rate = (net_amount / income * 100) if income > 0 else 0
    
    # Get top spending categories
    category_pipeline = [
        {"$match": {
            "user_id": str(current_user["_id"]),
            "transaction_type": "expense",
            "date": {"$gte": start_date, "$lte": end_date}
        }},
        {"$group": {
            "_id": "$category",
            "total_amount": {"$sum": "$amount"},
            "transaction_count": {"$sum": 1}
        }},
        {"$sort": {"total_amount": -1}},
        {"$limit": 10}
    ]
    
    category_summary = await db.transactions.aggregate(category_pipeline).to_list(None)
    
    # Calculate percentages
    total_expenses_for_percentage = expenses
    top_categories = []
    for category in category_summary:
        percentage = (category["total_amount"] / total_expenses_for_percentage * 100) if total_expenses_for_percentage > 0 else 0
        top_categories.append(SpendingByCategory(
            category=category["_id"],
            total_amount=category["total_amount"],
            transaction_count=category["transaction_count"],
            percentage=percentage
        ))
    
    # Get monthly trends
    monthly_pipeline = [
        {"$match": {
            "user_id": str(current_user["_id"]),
            "date": {"$gte": start_date, "$lte": end_date}
        }},
        {"$group": {
            "_id": {
                "year": {"$year": "$date"},
                "month": {"$month": "$date"},
                "type": "$transaction_type"
            },
            "total": {"$sum": "$amount"}
        }},
        {"$sort": {"_id.year": 1, "_id.month": 1}}
    ]
    
    monthly_data = await db.transactions.aggregate(monthly_pipeline).to_list(None)
    
    # Process monthly data
    monthly_trends = []
    monthly_dict = {}
    
    for item in monthly_data:
        year_month = f"{item['_id']['year']}-{item['_id']['month']:02d}"
        if year_month not in monthly_dict:
            monthly_dict[year_month] = {"income": 0, "expenses": 0}
        
        if item["_id"]["type"] == "income":
            monthly_dict[year_month]["income"] += item["total"]
        else:
            monthly_dict[year_month]["expenses"] += item["total"]
    
    for year_month, data in monthly_dict.items():
        monthly_trends.append(MonthlyTrend(
            month=year_month,
            income=data["income"],
            expenses=data["expenses"],
            net=data["income"] - data["expenses"]
        ))
    
    return FinancialSummary(
        total_income=income,
        total_expenses=expenses,
        net_amount=net_amount,
        savings_rate=savings_rate,
        top_spending_categories=top_categories,
        monthly_trends=monthly_trends
    )

@router.get("/spending-by-category")
async def get_spending_by_category(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database)
):
    if not start_date:
        start_date = datetime.utcnow() - timedelta(days=30)
    if not end_date:
        end_date = datetime.utcnow()
    
    pipeline = [
        {"$match": {
            "user_id": str(current_user["_id"]),
            "transaction_type": "expense",
            "date": {"$gte": start_date, "$lte": end_date}
        }},
        {"$group": {
            "_id": "$category",
            "total_amount": {"$sum": "$amount"},
            "transaction_count": {"$sum": 1}
        }},
        {"$sort": {"total_amount": -1}}
    ]
    
    categories = await db.transactions.aggregate(pipeline).to_list(None)
    
    result = []
    for category in categories:
        result.append(SpendingByCategory(
            category=category["_id"],
            total_amount=category["total_amount"],
            transaction_count=category["transaction_count"],
            percentage=0  # Will be calculated in frontend
        ))
    
    return result

@router.get("/monthly-trends")
async def get_monthly_trends(
    months: int = 12,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database)
):
    start_date = datetime.utcnow() - timedelta(days=months * 30)
    
    pipeline = [
        {"$match": {
            "user_id": str(current_user["_id"]),
            "date": {"$gte": start_date}
        }},
        {"$group": {
            "_id": {
                "year": {"$year": "$date"},
                "month": {"$month": "$date"},
                "type": "$transaction_type"
            },
            "total": {"$sum": "$amount"}
        }},
        {"$sort": {"_id.year": 1, "_id.month": 1}}
    ]
    
    monthly_data = await db.transactions.aggregate(pipeline).to_list(None)
    
    # Process monthly data
    monthly_trends = []
    monthly_dict = {}
    
    for item in monthly_data:
        year_month = f"{item['_id']['year']}-{item['_id']['month']:02d}"
        if year_month not in monthly_dict:
            monthly_dict[year_month] = {"income": 0, "expenses": 0}
        
        if item["_id"]["type"] == "income":
            monthly_dict[year_month]["income"] += item["total"]
        else:
            monthly_dict[year_month]["expenses"] += item["total"]
    
    for year_month, data in monthly_dict.items():
        monthly_trends.append(MonthlyTrend(
            month=year_month,
            income=data["income"],
            expenses=data["expenses"],
            net=data["income"] - data["expenses"]
        ))
    
    return monthly_trends

@router.get("/export/pdf")
async def export_financial_report_pdf(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database)
):
    if not start_date:
        start_date = datetime.utcnow() - timedelta(days=30)
    if not end_date:
        end_date = datetime.utcnow()
    
    # Get financial summary
    summary = await get_financial_summary(start_date, end_date, current_user, db)
    
    # Create PDF
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    # Title
    title = Paragraph(f"Financial Report for {current_user['full_name']}", styles['Title'])
    story.append(title)
    story.append(Spacer(1, 12))
    
    # Date range
    date_range = Paragraph(f"Period: {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}", styles['Normal'])
    story.append(date_range)
    story.append(Spacer(1, 12))
    
    # Summary table
    summary_data = [
        ['Metric', 'Amount'],
        ['Total Income', f"${summary.total_income:.2f}"],
        ['Total Expenses', f"${summary.total_expenses:.2f}"],
        ['Net Amount', f"${summary.net_amount:.2f}"],
        ['Savings Rate', f"{summary.savings_rate:.1f}%"]
    ]
    
    summary_table = Table(summary_data)
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 14),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    
    story.append(summary_table)
    story.append(Spacer(1, 12))
    
    # Top spending categories
    if summary.top_spending_categories:
        story.append(Paragraph("Top Spending Categories", styles['Heading2']))
        story.append(Spacer(1, 12))
        
        category_data = [['Category', 'Amount', 'Count', 'Percentage']]
        for category in summary.top_spending_categories:
            category_data.append([
                category.category,
                f"${category.total_amount:.2f}",
                str(category.transaction_count),
                f"{category.percentage:.1f}%"
            ])
        
        category_table = Table(category_data)
        category_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(category_table)
    
    doc.build(story)
    buffer.seek(0)
    
    # Convert to base64 for response
    pdf_content = buffer.getvalue()
    pdf_base64 = base64.b64encode(pdf_content).decode()
    
    return {
        "pdf_base64": pdf_base64,
        "filename": f"financial_report_{start_date.strftime('%Y%m%d')}_{end_date.strftime('%Y%m%d')}.pdf"
    }
