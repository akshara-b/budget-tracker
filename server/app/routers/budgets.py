from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from ..db import get_database
from ..routers.auth import get_current_user

router = APIRouter()

# Models
class BudgetCreate(BaseModel):
    name: str
    amount: float
    category: str
    period: str  # "monthly", "weekly", "yearly"
    start_date: datetime
    end_date: Optional[datetime] = None
    description: Optional[str] = None

class BudgetUpdate(BaseModel):
    name: Optional[str] = None
    amount: Optional[float] = None
    category: Optional[str] = None
    period: Optional[str] = None
    end_date: Optional[datetime] = None
    description: Optional[str] = None

class BudgetResponse(BaseModel):
    id: str
    user_id: str
    name: str
    amount: float
    category: str
    period: str
    start_date: datetime
    end_date: Optional[datetime]
    description: Optional[str]
    created_at: datetime
    updated_at: datetime

class BudgetProgress(BaseModel):
    budget_id: str
    budget_name: str
    category: str
    budget_amount: float
    spent_amount: float
    remaining_amount: float
    progress_percentage: float
    is_over_budget: bool

# Routes
@router.post("/", response_model=BudgetResponse)
async def create_budget(
    budget: BudgetCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database)
):
    budget_doc = {
        "user_id": str(current_user["_id"]),
        "name": budget.name,
        "amount": budget.amount,
        "category": budget.category,
        "period": budget.period,
        "start_date": budget.start_date,
        "end_date": budget.end_date,
        "description": budget.description,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await db.budgets.insert_one(budget_doc)
    budget_doc["id"] = str(result.inserted_id)
    
    return BudgetResponse(**budget_doc)

@router.get("/", response_model=List[BudgetResponse])
async def get_budgets(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database)
):
    cursor = db.budgets.find({"user_id": str(current_user["_id"])}).sort("created_at", -1)
    budgets = []
    
    async for document in cursor:
        document["id"] = str(document["_id"])
        budgets.append(BudgetResponse(**document))
    
    return budgets

@router.get("/progress/overview", response_model=List[BudgetProgress])
async def get_budget_progress(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database)
):
    # Get all budgets for the user
    budgets = await db.budgets.find({"user_id": str(current_user["_id"])}).to_list(None)
    
    budget_progress = []
    
    for budget in budgets:
        # Calculate spent amount for this budget category
        pipeline = [
            {"$match": {
                "user_id": str(current_user["_id"]),
                "category": budget["category"],
                "transaction_type": "expense",
                "date": {"$gte": budget["start_date"]}
            }},
            {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
        ]
        
        # Debug: Count all transactions for this category (without date filter)
        all_transactions_count = await db.transactions.count_documents({
            "user_id": str(current_user["_id"]),
            "category": budget["category"],
            "transaction_type": "expense"
        })
        
        # Debug: Count transactions within date range
        filtered_transactions_count = await db.transactions.count_documents({
            "user_id": str(current_user["_id"]),
            "category": budget["category"],
            "transaction_type": "expense",
            "date": {"$gte": budget["start_date"]}
        })
        
        print(f"Budget debug - Category: {budget['category']}")
        print(f"  - Start date: {budget['start_date']}")
        print(f"  - All transactions: {all_transactions_count}")
        print(f"  - Filtered transactions: {filtered_transactions_count}")
        
        result = await db.transactions.aggregate(pipeline).to_list(None)
        spent_amount = result[0]["total"] if result else 0.0
        
        print(f"  - Spent amount: {spent_amount}")
        
        progress_percentage = (spent_amount / budget["amount"]) * 100 if budget["amount"] > 0 else 0
        is_over_budget = spent_amount > budget["amount"]
        
        budget_progress.append(BudgetProgress(
            budget_id=str(budget["_id"]),
            budget_name=budget["name"],
            category=budget["category"],
            budget_amount=budget["amount"],
            spent_amount=spent_amount,
            remaining_amount=budget["amount"] - spent_amount,
            progress_percentage=progress_percentage,
            is_over_budget=is_over_budget
        ))
    
    return budget_progress

@router.get("/progress/{budget_id}", response_model=BudgetProgress)
async def get_specific_budget_progress(
    budget_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database)
):
    # Get the specific budget
    budget = await db.budgets.find_one({
        "_id": ObjectId(budget_id),
        "user_id": str(current_user["_id"])
    })
    
    if not budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found"
        )
    
    # Calculate spent amount for this budget category
    pipeline = [
        {"$match": {
            "user_id": str(current_user["_id"]),
            "category": budget["category"],
            "transaction_type": "expense",
            "date": {"$gte": budget["start_date"]}
        }},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
    ]
    
    result = await db.transactions.aggregate(pipeline).to_list(None)
    spent_amount = result[0]["total"] if result else 0.0
    
    progress_percentage = (spent_amount / budget["amount"]) * 100 if budget["amount"] > 0 else 0
    is_over_budget = spent_amount > budget["amount"]
    
    return BudgetProgress(
        budget_id=str(budget["_id"]),
        budget_name=budget["name"],
        category=budget["category"],
        budget_amount=budget["amount"],
        spent_amount=spent_amount,
        remaining_amount=budget["amount"] - spent_amount,
        progress_percentage=progress_percentage,
        is_over_budget=is_over_budget
    )

@router.get("/{budget_id}", response_model=BudgetResponse)
async def get_budget(
    budget_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database)
):
    budget = await db.budgets.find_one({
        "_id": ObjectId(budget_id),
        "user_id": str(current_user["_id"])
    })
    
    if not budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found"
        )
    
    budget["id"] = str(budget["_id"])
    return BudgetResponse(**budget)

@router.put("/{budget_id}", response_model=BudgetResponse)
async def update_budget(
    budget_id: str,
    budget_update: BudgetUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database)
):
    # Check if budget exists and belongs to user
    existing_budget = await db.budgets.find_one({
        "_id": ObjectId(budget_id),
        "user_id": str(current_user["_id"])
    })
    
    if not existing_budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found"
        )
    
    # Prepare update data
    update_data = budget_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.budgets.update_one(
        {"_id": ObjectId(budget_id)},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update budget"
        )
    
    # Return updated budget
    updated_budget = await db.budgets.find_one({"_id": ObjectId(budget_id)})
    updated_budget["id"] = str(updated_budget["_id"])
    
    return BudgetResponse(**updated_budget)

@router.delete("/{budget_id}")
async def delete_budget(
    budget_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database)
):
    # Check if budget exists and belongs to user
    existing_budget = await db.budgets.find_one({
        "_id": ObjectId(budget_id),
        "user_id": str(current_user["_id"])
    })
    
    if not existing_budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found"
        )
    
    result = await db.budgets.delete_one({"_id": ObjectId(budget_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete budget"
        )
    
    return {"message": "Budget deleted successfully"}
