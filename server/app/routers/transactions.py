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
class TransactionCreate(BaseModel):
    amount: float
    description: str
    category: str
    transaction_type: str  # "income" or "expense"
    date: datetime
    tags: Optional[List[str]] = []

class TransactionUpdate(BaseModel):
    amount: Optional[float] = None
    description: Optional[str] = None
    category: Optional[str] = None
    transaction_type: Optional[str] = None
    date: Optional[datetime] = None
    tags: Optional[List[str]] = None

class TransactionResponse(BaseModel):
    id: str
    user_id: str
    amount: float
    description: str
    category: str
    transaction_type: str
    date: datetime
    tags: List[str] = []
    created_at: datetime
    updated_at: datetime

# Routes
@router.post("/", response_model=TransactionResponse)
async def create_transaction(
    transaction: TransactionCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database)
):
    transaction_doc = {
        "user_id": str(current_user["_id"]),
        "amount": transaction.amount,
        "description": transaction.description,
        "category": transaction.category,
        "transaction_type": transaction.transaction_type,
        "date": transaction.date,
        "tags": transaction.tags,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await db.transactions.insert_one(transaction_doc)
    transaction_doc["id"] = str(result.inserted_id)
    
    return TransactionResponse(**transaction_doc)

@router.get("/", response_model=List[TransactionResponse])
async def get_transactions(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    transaction_type: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database)
):
    # Build filter query
    filter_query = {"user_id": str(current_user["_id"])}
    
    if category:
        filter_query["category"] = category
    if transaction_type:
        filter_query["transaction_type"] = transaction_type
    if start_date or end_date:
        date_filter = {}
        if start_date:
            date_filter["$gte"] = start_date
        if end_date:
            date_filter["$lte"] = end_date
        filter_query["date"] = date_filter
    
    cursor = db.transactions.find(filter_query).skip(skip).limit(limit).sort("date", -1)
    transactions = []
    
    async for document in cursor:
        document["id"] = str(document["_id"])
        transactions.append(TransactionResponse(**document))
    
    return transactions

@router.get("/summary/overview")
async def get_transaction_summary(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database)
):
    pipeline = [
        {"$match": {"user_id": str(current_user["_id"])}},
        {"$group": {
            "_id": "$transaction_type",
            "total": {"$sum": "$amount"},
            "count": {"$sum": 1}
        }}
    ]
    
    result = await db.transactions.aggregate(pipeline).to_list(None)
    
    summary = {
        "total_income": 0,
        "total_expenses": 0,
        "income_count": 0,
        "expense_count": 0,
        "net_balance": 0,
        "net_amount": 0,
        "transaction_count": 0
    }
    
    for item in result:
        if item["_id"] == "income":
            summary["total_income"] = item["total"]
            summary["income_count"] = item["count"]
        elif item["_id"] == "expense":
            summary["total_expenses"] = item["total"]
            summary["expense_count"] = item["count"]
    
    summary["net_balance"] = summary["total_income"] - summary["total_expenses"]
    summary["net_amount"] = summary["net_balance"]  # Alias for frontend
    summary["transaction_count"] = summary["income_count"] + summary["expense_count"]
    
    return summary

@router.get("/{transaction_id}", response_model=TransactionResponse)
async def get_transaction(
    transaction_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database)
):
    transaction = await db.transactions.find_one({
        "_id": ObjectId(transaction_id),
        "user_id": str(current_user["_id"])
    })
    
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    transaction["id"] = str(transaction["_id"])
    return TransactionResponse(**transaction)

@router.put("/{transaction_id}", response_model=TransactionResponse)
async def update_transaction(
    transaction_id: str,
    transaction_update: TransactionUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database)
):
    # Check if transaction exists and belongs to user
    existing_transaction = await db.transactions.find_one({
        "_id": ObjectId(transaction_id),
        "user_id": str(current_user["_id"])
    })
    
    if not existing_transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    # Prepare update data
    update_data = transaction_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.transactions.update_one(
        {"_id": ObjectId(transaction_id)},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update transaction"
        )
    
    # Return updated transaction
    updated_transaction = await db.transactions.find_one({"_id": ObjectId(transaction_id)})
    updated_transaction["id"] = str(updated_transaction["_id"])
    
    return TransactionResponse(**updated_transaction)

@router.delete("/{transaction_id}")
async def delete_transaction(
    transaction_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database)
):
    # Check if transaction exists and belongs to user
    existing_transaction = await db.transactions.find_one({
        "_id": ObjectId(transaction_id),
        "user_id": str(current_user["_id"])
    })
    
    if not existing_transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    result = await db.transactions.delete_one({"_id": ObjectId(transaction_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete transaction"
        )
    
    return {"message": "Transaction deleted successfully"}
