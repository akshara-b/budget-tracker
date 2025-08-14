from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from motor.motor_asyncio import AsyncIOMotorClient
from ..db import get_database
from ..routers.auth import get_current_user
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import numpy as np

router = APIRouter()

# Models
class SpendingPattern(BaseModel):
    category: str
    average_amount: float
    frequency: int
    trend: str  # "increasing", "decreasing", "stable"

class FinancialInsight(BaseModel):
    insight_type: str
    title: str
    description: str
    confidence: float
    actionable: bool
    recommendation: Optional[str] = None

class AnomalyDetection(BaseModel):
    transaction_id: str
    amount: float
    category: str
    date: datetime
    anomaly_score: float
    reason: str

class BudgetRecommendation(BaseModel):
    category: str
    recommended_amount: float
    reasoning: str
    confidence: float

# Routes
@router.get("/insights", response_model=List[FinancialInsight])
async def get_financial_insights(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database)
):
    insights = []
    
    # Get user's transaction data
    transactions = await db.transactions.find({"user_id": str(current_user["_id"])}).to_list(None)
    
    if not transactions:
        return insights
    
    # Convert to DataFrame for analysis
    df = pd.DataFrame(transactions)
    df['date'] = pd.to_datetime(df['date'])
    df['month'] = df['date'].dt.to_period('M')
    
    # Insight 1: Spending trend analysis
    if len(df) > 1:
        monthly_expenses = df[df['transaction_type'] == 'expense'].groupby('month')['amount'].sum()
        if len(monthly_expenses) > 2:
            trend = "increasing" if monthly_expenses.iloc[-1] > monthly_expenses.iloc[-2] else "decreasing"
            insights.append(FinancialInsight(
                insight_type="trend",
                title="Monthly Spending Trend",
                description=f"Your spending is {trend} month over month",
                confidence=0.8,
                actionable=True,
                recommendation="Consider reviewing your budget categories if spending is increasing"
            ))
    
    # Insight 2: Category analysis
    category_totals = df[df['transaction_type'] == 'expense'].groupby('category')['amount'].sum()
    if len(category_totals) > 0:
        top_category = category_totals.idxmax()
        top_amount = category_totals.max()
        total_expenses = category_totals.sum()
        percentage = (top_amount / total_expenses) * 100
        
        if percentage > 40:
            insights.append(FinancialInsight(
                insight_type="category",
                title="High Category Concentration",
                description=f"{top_category} accounts for {percentage:.1f}% of your expenses",
                confidence=0.9,
                actionable=True,
                recommendation="Consider diversifying your spending or setting a budget limit for this category"
            ))
    
    # Insight 3: Income vs Expenses ratio
    total_income = df[df['transaction_type'] == 'income']['amount'].sum()
    total_expenses = df[df['transaction_type'] == 'expense']['amount'].sum()
    
    if total_income > 0:
        savings_rate = ((total_income - total_expenses) / total_income) * 100
        
        if savings_rate < 20:
            insights.append(FinancialInsight(
                insight_type="savings",
                title="Low Savings Rate",
                description=f"Your savings rate is {savings_rate:.1f}%",
                confidence=0.85,
                actionable=True,
                recommendation="Aim for at least 20% savings rate by reducing non-essential expenses"
            ))
        elif savings_rate > 50:
            insights.append(FinancialInsight(
                insight_type="savings",
                title="Excellent Savings Rate",
                description=f"Your savings rate is {savings_rate:.1f}% - great job!",
                confidence=0.9,
                actionable=False,
                recommendation="Consider investing your savings for long-term growth"
            ))
    
    # Insight 4: Spending consistency
    if len(df) > 10:
        expense_df = df[df['transaction_type'] == 'expense']
        daily_expenses = expense_df.groupby(expense_df['date'].dt.date)['amount'].sum()
        expense_std = daily_expenses.std()
        expense_mean = daily_expenses.mean()
        
        if expense_std > expense_mean * 0.5:
            insights.append(FinancialInsight(
                insight_type="consistency",
                title="High Spending Variability",
                description="Your daily spending varies significantly",
                confidence=0.75,
                actionable=True,
                recommendation="Try to maintain more consistent daily spending patterns"
            ))
    
    return insights

@router.get("/anomalies", response_model=List[AnomalyDetection])
async def detect_anomalies(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database)
):
    anomalies = []
    
    # Get user's transaction data
    transactions = await db.transactions.find({"user_id": str(current_user["_id"])}).to_list(None)
    
    if len(transactions) < 10:
        return anomalies
    
    # Convert to DataFrame
    df = pd.DataFrame(transactions)
    df['date'] = pd.to_datetime(df['date'])
    
    # Focus on expenses for anomaly detection
    expense_df = df[df['transaction_type'] == 'expense'].copy()
    
    if len(expense_df) < 5:
        return anomalies
    
    # Calculate statistical measures for each category
    for category in expense_df['category'].unique():
        category_data = expense_df[expense_df['category'] == category]['amount']
        
        if len(category_data) < 3:
            continue
        
        mean_amount = category_data.mean()
        std_amount = category_data.std()
        
        if std_amount == 0:
            continue
        
        # Find transactions that are more than 2 standard deviations from the mean
        z_scores = np.abs((category_data - mean_amount) / std_amount)
        anomaly_indices = z_scores > 2
        
        for idx, is_anomaly in enumerate(anomaly_indices):
            if is_anomaly:
                transaction = expense_df[expense_df['category'] == category].iloc[idx]
                anomaly_score = z_scores.iloc[idx]
                
                reason = "Unusually high amount" if transaction['amount'] > mean_amount else "Unusually low amount"
                
                anomalies.append(AnomalyDetection(
                    transaction_id=str(transaction['_id']),
                    amount=transaction['amount'],
                    category=category,
                    date=transaction['date'],
                    anomaly_score=float(anomaly_score),
                    reason=reason
                ))
    
    # Sort by anomaly score
    anomalies.sort(key=lambda x: x.anomaly_score, reverse=True)
    
    return anomalies[:10]  # Return top 10 anomalies

@router.get("/spending-patterns", response_model=List[SpendingPattern])
async def analyze_spending_patterns(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database)
):
    patterns = []
    
    # Get user's transaction data
    transactions = await db.transactions.find({"user_id": str(current_user["_id"])}).to_list(None)
    
    if not transactions:
        return patterns
    
    # Convert to DataFrame
    df = pd.DataFrame(transactions)
    df['date'] = pd.to_datetime(df['date'])
    df['month'] = df['date'].dt.to_period('M')
    
    # Focus on expenses
    expense_df = df[df['transaction_type'] == 'expense']
    
    if len(expense_df) == 0:
        return patterns
    
    # Analyze each category
    for category in expense_df['category'].unique():
        category_data = expense_df[expense_df['category'] == category]
        
        if len(category_data) < 2:
            continue
        
        # Calculate average amount and frequency
        average_amount = category_data['amount'].mean()
        frequency = len(category_data)
        
        # Determine trend
        monthly_totals = category_data.groupby('month')['amount'].sum()
        if len(monthly_totals) >= 2:
            recent_trend = monthly_totals.iloc[-1] - monthly_totals.iloc[-2]
            if recent_trend > 0:
                trend = "increasing"
            elif recent_trend < 0:
                trend = "decreasing"
            else:
                trend = "stable"
        else:
            trend = "stable"
        
        patterns.append(SpendingPattern(
            category=category,
            average_amount=float(average_amount),
            frequency=frequency,
            trend=trend
        ))
    
    # Sort by average amount
    patterns.sort(key=lambda x: x.average_amount, reverse=True)
    
    return patterns

@router.get("/budget-recommendations", response_model=List[BudgetRecommendation])
async def get_budget_recommendations(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database)
):
    recommendations = []
    
    # Get user's transaction data
    transactions = await db.transactions.find({"user_id": str(current_user["_id"])}).to_list(None)
    
    if not transactions:
        return recommendations
    
    # Convert to DataFrame
    df = pd.DataFrame(transactions)
    df['date'] = pd.to_datetime(df['date'])
    
    # Focus on expenses
    expense_df = df[df['transaction_type'] == 'expense']
    
    if len(expense_df) == 0:
        return recommendations
    
    # Get total expenses
    total_expenses = expense_df['amount'].sum()
    
    # Analyze each category
    for category in expense_df['category'].unique():
        category_data = expense_df[expense_df['category'] == category]
        
        if len(category_data) < 3:
            continue
        
        # Calculate category statistics
        category_total = category_data['amount'].sum()
        category_percentage = (category_total / total_expenses) * 100
        category_avg = category_data['amount'].mean()
        category_std = category_data['amount'].std()
        
        # Generate recommendation based on spending patterns
        if category_percentage > 30:
            # High spending category - recommend reduction
            recommended_amount = category_total * 0.8  # 20% reduction
            reasoning = f"This category represents {category_percentage:.1f}% of your total expenses"
            confidence = 0.9
        elif category_percentage < 5:
            # Low spending category - might be under-budgeted
            recommended_amount = category_total * 1.2  # 20% increase
            reasoning = f"This category is only {category_percentage:.1f}% of your expenses"
            confidence = 0.7
        else:
            # Moderate spending - maintain current level
            recommended_amount = category_total
            reasoning = f"This category has moderate spending at {category_percentage:.1f}%"
            confidence = 0.8
        
        # Adjust for variability
        if category_std > category_avg * 0.5:
            recommended_amount *= 1.1  # Add 10% buffer for high variability
            reasoning += " - High spending variability suggests adding buffer"
        
        recommendations.append(BudgetRecommendation(
            category=category,
            recommended_amount=float(recommended_amount),
            reasoning=reasoning,
            confidence=confidence
        ))
    
    # Sort by confidence
    recommendations.sort(key=lambda x: x.confidence, reverse=True)
    
    return recommendations

@router.get("/predictions/spending-forecast")
async def predict_spending_forecast(
    months_ahead: int = 3,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database)
):
    # Get user's transaction data
    transactions = await db.transactions.find({"user_id": str(current_user["_id"])}).to_list(None)
    
    if len(transactions) < 6:
        return {"error": "Insufficient data for prediction"}
    
    # Convert to DataFrame
    df = pd.DataFrame(transactions)
    df['date'] = pd.to_datetime(df['date'])
    df['month'] = df['date'].dt.to_period('M')
    
    # Focus on expenses
    expense_df = df[df['transaction_type'] == 'expense']
    
    if len(expense_df) == 0:
        return {"error": "No expense data available"}
    
    # Group by month and calculate total expenses
    monthly_expenses = expense_df.groupby('month')['amount'].sum().reset_index()
    monthly_expenses['month_num'] = monthly_expenses['month'].astype(str).str.replace('-', '').astype(int)
    
    if len(monthly_expenses) < 3:
        return {"error": "Insufficient monthly data for prediction"}
    
    # Simple linear regression for prediction
    X = monthly_expenses['month_num'].values.reshape(-1, 1)
    y = monthly_expenses['amount'].values
    
    # Calculate trend
    slope = np.polyfit(monthly_expenses['month_num'], monthly_expenses['amount'], 1)[0]
    
    # Predict future months
    last_month = monthly_expenses['month_num'].max()
    predictions = []
    
    for i in range(1, months_ahead + 1):
        future_month = last_month + i
        predicted_amount = monthly_expenses['amount'].mean() + (slope * i)
        
        predictions.append({
            "month": str(future_month),
            "predicted_amount": max(0, predicted_amount),
            "confidence": max(0.3, 1.0 - (i * 0.1))  # Confidence decreases with time
        })
    
    return {
        "current_trend": "increasing" if slope > 0 else "decreasing",
        "trend_strength": abs(slope),
        "predictions": predictions,
        "method": "linear_regression"
    }
