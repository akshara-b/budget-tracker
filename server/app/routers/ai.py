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
    
    if len(transactions) < 3:  # Reduced from 10 to 3
        return anomalies
    
    # Convert to DataFrame
    df = pd.DataFrame(transactions)
    df['date'] = pd.to_datetime(df['date'])
    
    # Focus on expenses for anomaly detection
    expense_df = df[df['transaction_type'] == 'expense'].copy()
    
    if len(expense_df) < 2:  # Reduced from 5 to 2
        return anomalies
    
    # Calculate statistical measures for each category
    for category in expense_df['category'].unique():
        category_data = expense_df[expense_df['category'] == category]['amount']
        
        if len(category_data) < 2:  # Reduced from 3 to 2
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
    
    # Get user's existing budgets
    budgets = await db.budgets.find({"user_id": str(current_user["_id"])}).to_list(None)
    budget_dict = {budget['category']: budget for budget in budgets}
    
    if not transactions:
        # Provide starter recommendations for new users
        starter_recommendations = [
            {
                "category": "Food & Dining",
                "recommended_amount": 400.0,
                "reasoning": "Recommended starting budget for food and dining expenses",
                "confidence": 0.7
            },
            {
                "category": "Transportation",
                "recommended_amount": 300.0,
                "reasoning": "Recommended starting budget for transportation costs",
                "confidence": 0.7
            },
            {
                "category": "Entertainment",
                "recommended_amount": 200.0,
                "reasoning": "Recommended starting budget for entertainment and leisure",
                "confidence": 0.6
            }
        ]
        return [BudgetRecommendation(**rec) for rec in starter_recommendations]
    
    # Convert to DataFrame
    df = pd.DataFrame(transactions)
    df['date'] = pd.to_datetime(df['date'])
    
    # Focus on expenses from the last 3 months for more relevant recommendations
    three_months_ago = datetime.now() - timedelta(days=90)
    recent_df = df[df['date'] >= three_months_ago]
    expense_df = recent_df[recent_df['transaction_type'] == 'expense']
    
    if len(expense_df) == 0:
        return recommendations
    
    # Get total expenses and income for context
    total_expenses = expense_df['amount'].sum()
    income_df = recent_df[recent_df['transaction_type'] == 'income']
    total_income = income_df['amount'].sum() if len(income_df) > 0 else 0
    
    # Calculate category statistics
    category_stats = expense_df.groupby('category').agg({
        'amount': ['sum', 'mean', 'std', 'count']
    }).round(2)
    category_stats.columns = ['total', 'mean', 'std', 'count']
    category_stats['percentage'] = (category_stats['total'] / total_expenses * 100).round(1)
    
    # Generate recommendations for each category
    for category in category_stats.index:
        stats = category_stats.loc[category]
        
        # Skip categories with very few transactions
        if stats['count'] < 2:
            continue
        
        category_total = stats['total']
        category_percentage = stats['percentage']
        category_mean = stats['mean']
        category_std = stats['std'] if not pd.isna(stats['std']) else 0
        
        # Check if user has existing budget for this category
        existing_budget = budget_dict.get(category)
        
        # Determine recommendation logic based on spending patterns
        if category_percentage > 35:
            # Very high spending category - recommend reduction
            if existing_budget:
                current_budget = existing_budget['amount']
                recommended_amount = min(current_budget * 0.85, category_total * 0.8)
                reasoning = f"High spending category ({category_percentage}%) - reduce from current budget of ${current_budget:.0f}"
            else:
                recommended_amount = category_total * 0.8
                reasoning = f"High spending category ({category_percentage}%) - consider setting a limit to control expenses"
            confidence = 0.9
            
        elif category_percentage > 20:
            # Moderate-high spending - optimize based on variability
            if category_std > category_mean * 0.6:
                # High variability - add buffer
                recommended_amount = category_total * 1.2
                reasoning = f"Moderate spending ({category_percentage}%) with high variability - add 20% buffer"
                confidence = 0.8
            else:
                # Stable spending - maintain with slight optimization
                recommended_amount = category_total * 1.05
                reasoning = f"Stable moderate spending ({category_percentage}%) - maintain current level"
                confidence = 0.85
                
        elif category_percentage < 5:
            # Low spending category - might need more budget
            if existing_budget and existing_budget['amount'] > category_total * 2:
                # Existing budget is much higher than spending
                recommended_amount = category_total * 1.5
                reasoning = f"Low utilization ({category_percentage}%) - current budget may be too high"
                confidence = 0.7
            else:
                recommended_amount = category_total * 1.3
                reasoning = f"Low spending category ({category_percentage}%) - consider if more budget is needed"
                confidence = 0.6
        else:
            # Balanced spending - optimize based on trends
            recommended_amount = category_total * 1.1
            reasoning = f"Balanced spending ({category_percentage}%) - slight increase for buffer"
            confidence = 0.75
        
        # Adjust for income ratio if we have income data
        if total_income > 0:
            income_ratio = category_total / total_income
            if income_ratio > 0.15:  # Category is more than 15% of income
                recommended_amount *= 0.9  # Reduce slightly
                reasoning += f" (high income ratio: {income_ratio*100:.1f}%)"
        
        # Add seasonal adjustment for certain categories
        current_month = datetime.now().month
        if category.lower() in ['utilities', 'heating', 'cooling']:
            if current_month in [6, 7, 8]:  # Summer months
                recommended_amount *= 1.2
                reasoning += " (summer adjustment)"
            elif current_month in [12, 1, 2]:  # Winter months
                recommended_amount *= 1.3
                reasoning += " (winter adjustment)"
        
        recommendations.append(BudgetRecommendation(
            category=category,
            recommended_amount=float(recommended_amount),
            reasoning=reasoning,
            confidence=confidence
        ))
    
    # Add recommendations for common categories user might be missing
    common_categories = ['Emergency Fund', 'Savings', 'Health & Medical', 'Insurance']
    existing_categories = set(category_stats.index) | set(budget_dict.keys())
    
    for common_cat in common_categories:
        if common_cat not in existing_categories and total_income > 0:
            if common_cat == 'Emergency Fund':
                recommended_amount = total_income * 0.1  # 10% of income
                reasoning = "Build emergency fund with 10% of monthly income"
                confidence = 0.9
            elif common_cat == 'Savings':
                recommended_amount = total_income * 0.2  # 20% of income
                reasoning = "Recommended savings rate of 20% of monthly income"
                confidence = 0.85
            elif common_cat == 'Health & Medical':
                recommended_amount = total_income * 0.05  # 5% of income
                reasoning = "Allocate 5% of income for health and medical expenses"
                confidence = 0.7
            elif common_cat == 'Insurance':
                recommended_amount = total_income * 0.08  # 8% of income
                reasoning = "Recommended insurance allocation of 8% of monthly income"
                confidence = 0.75
            
            recommendations.append(BudgetRecommendation(
                category=common_cat,
                recommended_amount=float(recommended_amount),
                reasoning=reasoning,
                confidence=confidence
            ))
    
    # Sort by confidence and limit to top 8 recommendations
    recommendations.sort(key=lambda x: x.confidence, reverse=True)
    return recommendations[:8]

@router.get("/predictions/spending-forecast")
async def predict_spending_forecast(
    months_ahead: int = 3,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database)
):
    # Get user's transaction and budget data
    transactions = await db.transactions.find({"user_id": str(current_user["_id"])}).to_list(None)
    budgets = await db.budgets.find({"user_id": str(current_user["_id"])}).to_list(None)
    
    if len(transactions) < 3:
        return {
            "current_trend": "insufficient_data",
            "trend_strength": 0,
            "predictions": [{
                "title": "Getting Started",
                "category": "Overall",
                "predicted_amount": 0,
                "confidence": 0,
                "trend": "stable",
                "description": "Add more transactions to generate accurate forecasts",
                "timeframe": "Next 3 months",
                "factors": ["Insufficient transaction history"],
                "recommendations": [
                    "Continue adding transactions for better predictions",
                    "Set up budget categories for more detailed forecasts"
                ]
            }],
            "method": "insufficient_data"
        }
    
    # Convert to DataFrame
    df = pd.DataFrame(transactions)
    df['date'] = pd.to_datetime(df['date'])
    df['month'] = df['date'].dt.to_period('M')
    
    # Focus on expenses
    expense_df = df[df['transaction_type'] == 'expense']
    income_df = df[df['transaction_type'] == 'income']
    
    if len(expense_df) == 0:
        return {"error": "No expense data available"}
    
    # Create comprehensive forecasts
    forecasts = []
    
    # 1. Overall Spending Forecast
    monthly_expenses = expense_df.groupby('month')['amount'].sum().reset_index()
    monthly_expenses['month_num'] = range(len(monthly_expenses))
    
    if len(monthly_expenses) >= 2:
        # Calculate trend
        recent_months = monthly_expenses.tail(3)['amount'].values
        older_months = monthly_expenses.head(max(1, len(monthly_expenses)-3))['amount'].values
        
        recent_avg = recent_months.mean()
        older_avg = older_months.mean() if len(older_months) > 0 else recent_avg
        
        trend_change = ((recent_avg - older_avg) / older_avg * 100) if older_avg > 0 else 0
        
        # Predict next month spending
        if len(monthly_expenses) >= 3:
            slope = np.polyfit(monthly_expenses['month_num'], monthly_expenses['amount'], 1)[0]
            predicted_amount = recent_avg + slope
        else:
            predicted_amount = recent_avg
        
        # Seasonal adjustments based on current month
        current_month = datetime.now().month
        seasonal_factor = 1.0
        seasonal_factors = []
        
        if current_month in [11, 12]:  # Holiday season
            seasonal_factor = 1.2
            seasonal_factors.append("Holiday season typically increases spending")
        elif current_month in [1, 2]:  # Post-holiday
            seasonal_factor = 0.9
            seasonal_factors.append("Post-holiday period usually sees reduced spending")
        elif current_month in [6, 7, 8]:  # Summer
            seasonal_factor = 1.1
            seasonal_factors.append("Summer activities may increase expenses")
        
        predicted_amount *= seasonal_factor
        
        # Determine trend and confidence
        trend = "increasing" if trend_change > 5 else "decreasing" if trend_change < -5 else "stable"
        confidence = min(95, max(50, 85 - abs(trend_change) * 2))
        
        # Generate insights and recommendations
        factors = []
        recommendations = []
        
        if trend_change > 15:
            factors.append(f"Spending has increased by {trend_change:.1f}% recently")
            recommendations.append("Consider reviewing recent expenses for cost-cutting opportunities")
        elif trend_change < -15:
            factors.append(f"Spending has decreased by {abs(trend_change):.1f}% recently")
            recommendations.append("Great job on reducing expenses! Consider allocating savings to investments")
        
        factors.extend(seasonal_factors)
        
        # Add variability factor
        spending_std = monthly_expenses['amount'].std()
        spending_cv = spending_std / monthly_expenses['amount'].mean() if monthly_expenses['amount'].mean() > 0 else 0
        
        if spending_cv > 0.3:
            factors.append("High variability in monthly spending")
            recommendations.append("Consider creating a more consistent budget plan")
            confidence *= 0.8
        
        forecasts.append({
            "title": "Overall Spending Forecast",
            "category": "Total Expenses",
            "predicted_amount": float(predicted_amount),
            "current_average": float(recent_avg),
            "trend": trend,
            "trend_change": round(trend_change, 1),
            "confidence": round(confidence),
            "timeframe": "Next month",
            "description": f"Based on recent trends, expect {trend} spending pattern",
            "factors": factors[:4],
            "recommendations": recommendations[:2]
        })
    
    # 2. Category-specific Forecasts
    category_expenses = expense_df.groupby(['category', 'month'])['amount'].sum().reset_index()
    
    # Get top spending categories for detailed forecasts
    top_categories = expense_df.groupby('category')['amount'].sum().nlargest(4).index
    
    for category in top_categories:
        category_data = category_expenses[category_expenses['category'] == category]
        
        if len(category_data) >= 2:
            category_data = category_data.sort_values('month')
            recent_spending = category_data.tail(2)['amount'].values
            
            if len(recent_spending) >= 2:
                trend_change = ((recent_spending[-1] - recent_spending[0]) / recent_spending[0] * 100) if recent_spending[0] > 0 else 0
                predicted_amount = recent_spending.mean()
                
                # Category-specific adjustments
                if category.lower() in ['food', 'groceries', 'dining']:
                    if current_month in [11, 12]:
                        predicted_amount *= 1.15
                elif category.lower() in ['utilities', 'electricity', 'gas']:
                    if current_month in [6, 7, 8]:  # Summer cooling
                        predicted_amount *= 1.3
                    elif current_month in [12, 1, 2]:  # Winter heating
                        predicted_amount *= 1.4
                elif category.lower() in ['transportation', 'fuel', 'gas']:
                    if current_month in [6, 7, 8]:  # Summer travel
                        predicted_amount *= 1.2
                
                trend = "increasing" if trend_change > 10 else "decreasing" if trend_change < -10 else "stable"
                confidence = min(90, max(60, 80 - abs(trend_change)))
                
                # Category-specific insights
                factors = []
                recommendations = []
                
                if category.lower() in ['entertainment', 'dining', 'shopping']:
                    if trend_change > 20:
                        factors.append(f"Discretionary spending in {category} is rising")
                        recommendations.append(f"Set monthly limits for {category} expenses")
                elif category.lower() in ['utilities', 'rent', 'insurance']:
                    factors.append(f"Fixed expense category with predictable patterns")
                    if trend_change > 10:
                        recommendations.append(f"Review {category} providers for better rates")
                
                # Check against budget if exists
                budget_dict = {b['category']: b for b in budgets}
                if category in budget_dict:
                    budget_amount = budget_dict[category]['amount']
                    if predicted_amount > budget_amount * 1.1:
                        factors.append(f"Forecast exceeds budget by {((predicted_amount/budget_amount-1)*100):.1f}%")
                        recommendations.append(f"Adjust {category} budget or spending habits")
                
                forecasts.append({
                    "title": f"{category} Forecast",
                    "category": category,
                    "predicted_amount": float(predicted_amount),
                    "current_average": float(recent_spending.mean()),
                    "trend": trend,
                    "trend_change": round(trend_change, 1),
                    "confidence": round(confidence),
                    "timeframe": "Next month",
                    "description": f"{category} spending shows {trend} pattern",
                    "factors": factors[:3],
                    "recommendations": recommendations[:2]
                })
    
    # 3. Income vs Expense Balance Forecast
    if len(income_df) > 0:
        monthly_income = income_df.groupby('month')['amount'].sum()
        monthly_expense = expense_df.groupby('month')['amount'].sum()
        
        # Align the periods
        common_months = monthly_income.index.intersection(monthly_expense.index)
        if len(common_months) >= 2:
            recent_income = monthly_income[common_months].tail(2).mean()
            recent_expense = monthly_expense[common_months].tail(2).mean()
            
            savings_rate = ((recent_income - recent_expense) / recent_income) * 100 if recent_income > 0 else 0
            
            # Predict future balance
            predicted_income = recent_income  # Assume income stays stable
            predicted_expense = predicted_amount if 'predicted_amount' in locals() else recent_expense
            predicted_savings_rate = ((predicted_income - predicted_expense) / predicted_income) * 100 if predicted_income > 0 else 0
            
            trend = "improving" if predicted_savings_rate > savings_rate else "declining"
            confidence = 75
            
            factors = [
                f"Current savings rate: {savings_rate:.1f}%",
                f"Predicted savings rate: {predicted_savings_rate:.1f}%"
            ]
            
            recommendations = []
            if predicted_savings_rate < 10:
                recommendations.append("Aim to save at least 10% of income")
            if predicted_savings_rate < savings_rate:
                recommendations.append("Consider reducing discretionary expenses")
            
            forecasts.append({
                "title": "Savings Rate Forecast",
                "category": "Financial Health",
                "predicted_amount": float(predicted_income - predicted_expense),
                "current_average": float(recent_income - recent_expense),
                "trend": trend,
                "trend_change": round(predicted_savings_rate - savings_rate, 1),
                "confidence": confidence,
                "timeframe": "Next month",
                "description": f"Expected savings rate of {predicted_savings_rate:.1f}%",
                "factors": factors,
                "recommendations": recommendations[:2]
            })
    
    # Sort forecasts by relevance (overall first, then by spending amount)
    forecasts.sort(key=lambda x: (
        0 if x['category'] == 'Total Expenses' else
        1 if x['category'] == 'Financial Health' else
        2 - (x.get('current_average', 0) / 1000)  # Higher spending = higher priority
    ))
    
    return {
        "current_trend": forecasts[0]['trend'] if forecasts else "stable",
        "trend_strength": abs(forecasts[0].get('trend_change', 0)) if forecasts else 0,
        "predictions": forecasts[:6],  # Return top 6 forecasts
        "method": "enhanced_analysis"
    }

# Personalized Advice Model
class PersonalizedAdvice(BaseModel):
    title: str
    description: str
    type: str  # "warning", "success", "trend_up", "trend_down", "tip"
    priority: str  # "high", "medium", "low"
    category: Optional[str] = None
    confidence: float
    actionItems: Optional[List[str]] = None

@router.get("/advice", response_model=List[PersonalizedAdvice])
async def get_personalized_advice(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database)
):
    advice_list = []
    
    # Get user's transaction data
    transactions = await db.transactions.find({"user_id": str(current_user["_id"])}).to_list(None)
    budgets = await db.budgets.find({"user_id": str(current_user["_id"])}).to_list(None)
    
    if not transactions:
        # Advice for new users
        advice_list.append(PersonalizedAdvice(
            title="Welcome to Smart Financial Management!",
            description="Start by adding your income and expense transactions to get personalized insights.",
            type="tip",
            priority="high",
            confidence=1.0,
            actionItems=[
                "Add your recent transactions",
                "Set up budget categories",
                "Review your spending patterns weekly"
            ]
        ))
        return advice_list
    
    # Convert to DataFrame for analysis
    df = pd.DataFrame(transactions)
    df['date'] = pd.to_datetime(df['date'])
    
    # Recent data (last 30 days)
    thirty_days_ago = datetime.now() - timedelta(days=30)
    recent_df = df[df['date'] >= thirty_days_ago]
    
    # Calculate basic metrics
    total_income = df[df['transaction_type'] == 'income']['amount'].sum()
    total_expenses = df[df['transaction_type'] == 'expense']['amount'].sum()
    recent_expenses = recent_df[recent_df['transaction_type'] == 'expense']['amount'].sum()
    
    # Advice 1: Savings Rate Analysis
    if total_income > 0:
        savings_rate = ((total_income - total_expenses) / total_income) * 100
        if savings_rate < 10:
            advice_list.append(PersonalizedAdvice(
                title="Low Savings Rate Alert",
                description=f"Your current savings rate is {savings_rate:.1f}%. Financial experts recommend saving at least 20% of income.",
                type="warning",
                priority="high",
                category="Savings",
                confidence=0.9,
                actionItems=[
                    "Review and reduce discretionary spending",
                    "Set up automatic savings transfers",
                    "Consider the 50/30/20 budgeting rule"
                ]
            ))
        elif savings_rate > 30:
            advice_list.append(PersonalizedAdvice(
                title="Excellent Savings Rate!",
                description=f"Your savings rate of {savings_rate:.1f}% is excellent! You're building strong financial security.",
                type="success",
                priority="low",
                category="Savings",
                confidence=0.95,
                actionItems=[
                    "Consider increasing investment contributions",
                    "Explore high-yield savings accounts",
                    "Build an emergency fund if not already done"
                ]
            ))
    
    # Advice 2: Category Spending Analysis
    if len(recent_df) > 0:
        expense_df = recent_df[recent_df['transaction_type'] == 'expense']
        if len(expense_df) > 0:
            category_totals = expense_df.groupby('category')['amount'].sum()
            top_category = category_totals.idxmax()
            top_percentage = (category_totals.max() / category_totals.sum()) * 100
            
            if top_percentage > 40:
                advice_list.append(PersonalizedAdvice(
                    title=f"High Spending in {top_category}",
                    description=f"{top_category} accounts for {top_percentage:.1f}% of your recent expenses. Consider if this aligns with your priorities.",
                    type="warning",
                    priority="medium",
                    category=top_category,
                    confidence=0.85,
                    actionItems=[
                        f"Review {top_category} transactions for unnecessary expenses",
                        f"Set a monthly budget limit for {top_category}",
                        "Look for alternatives or ways to reduce costs"
                    ]
                ))
    
    # Advice 3: Budget vs Actual Analysis
    if budgets and len(df) > 0:
        expense_df = df[df['transaction_type'] == 'expense']
        for budget in budgets:
            category = budget['category']
            budget_amount = budget['amount']
            
            # Calculate actual spending for this category
            category_spending = expense_df[expense_df['category'] == category]['amount'].sum()
            
            if category_spending > budget_amount * 1.2:  # 20% over budget
                advice_list.append(PersonalizedAdvice(
                    title=f"Over Budget: {category}",
                    description=f"You've spent ${category_spending:.0f} in {category}, which is ${category_spending - budget_amount:.0f} over your budget of ${budget_amount:.0f}.",
                    type="trend_up",
                    priority="high",
                    category=category,
                    confidence=0.95,
                    actionItems=[
                        f"Review recent {category} transactions",
                        "Consider adjusting the budget or spending habits",
                        "Set up spending alerts for this category"
                    ]
                ))
            elif category_spending < budget_amount * 0.5:  # Under 50% of budget
                advice_list.append(PersonalizedAdvice(
                    title=f"Under Budget: {category}",
                    description=f"You've only spent ${category_spending:.0f} of your ${budget_amount:.0f} budget for {category}. Great job staying under budget!",
                    type="success",
                    priority="low",
                    category=category,
                    confidence=0.8,
                    actionItems=[
                        "Consider if the budget allocation is too high",
                        "Reallocate unused budget to savings",
                        "Use extra budget for debt payoff if applicable"
                    ]
                ))
    
    # Advice 4: Transaction Frequency Analysis
    if len(df) > 10:
        transaction_counts = df.groupby(df['date'].dt.date).size()
        avg_daily_transactions = transaction_counts.mean()
        
        if avg_daily_transactions > 5:
            advice_list.append(PersonalizedAdvice(
                title="High Transaction Frequency",
                description=f"You average {avg_daily_transactions:.1f} transactions per day. Consider consolidating purchases to better track spending.",
                type="tip",
                priority="low",
                confidence=0.7,
                actionItems=[
                    "Plan weekly shopping trips",
                    "Use a shopping list to avoid impulse purchases",
                    "Consider setting a 'no spend' day each week"
                ]
            ))
    
    # Advice 5: Emergency Fund Check
    if total_income > 0 and not any(t.get('category', '').lower() in ['emergency', 'emergency fund'] for t in transactions):
        monthly_expenses = total_expenses / max(1, len(df.groupby(df['date'].dt.to_period('M'))))
        if total_income > monthly_expenses:
            advice_list.append(PersonalizedAdvice(
                title="Build an Emergency Fund",
                description="You don't appear to have transactions for an emergency fund. Building 3-6 months of expenses is crucial for financial security.",
                type="warning",
                priority="high",
                category="Emergency Fund",
                confidence=0.8,
                actionItems=[
                    f"Save ${monthly_expenses * 3:.0f} for a 3-month emergency fund",
                    "Open a separate high-yield savings account",
                    "Automate monthly transfers to emergency fund"
                ]
            ))
    
    # Sort by priority and confidence
    priority_order = {"high": 3, "medium": 2, "low": 1}
    advice_list.sort(key=lambda x: (priority_order.get(x.priority, 0), x.confidence), reverse=True)
    
    return advice_list[:6]  # Return top 6 pieces of advice
