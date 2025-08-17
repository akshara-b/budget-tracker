#!/usr/bin/env python3
"""
Script to add sample budgets that match the transaction categories
"""
import asyncio
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient

# Hardcoded user option - set USE_HARDCODED_USER to True to use specific user
USE_HARDCODED_USER = True
HARDCODED_USER = {
    "email": "",
    "name": ""
}

async def add_sample_budgets():
    """Add sample budgets for testing"""
    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient("mongodb://localhost:27017")
        db = client.budget_ai
        
        # Get user based on configuration
        if USE_HARDCODED_USER:
            # Find specific user by email
            user = await db.users.find_one({"email": HARDCODED_USER["email"]})
            if not user:
                print(f"❌ Hardcoded user '{HARDCODED_USER['email']}' not found.")
                print("Available users:")
                all_users = await db.users.find({}, {"email": 1, "name": 1}).to_list(10)
                for u in all_users:
                    print(f"   - {u.get('email', 'no email')} ({u.get('name', 'no name')})")
                return
            print(f"✅ Using hardcoded user: {user.get('email')} ({user.get('name')})")
        else:
            # Get the first user (original behavior)
            users = await db.users.find().to_list(1)
            if not users:
                print("❌ No users found. Please create a user first.")
                return
            user = users[0]
            print(f"✅ Using first available user: {user.get('email', 'unknown')}")
        
        user_id = str(user["_id"])
        
        # Clear existing budgets
        await db.budgets.delete_many({"user_id": user_id})
        
        # Budget categories that match our transaction data
        budget_data = [
            {
                "name": "Food & Dining Budget",
                "category": "Food & Dining", 
                "amount": 800.0,
                "period": "monthly",
                "description": "Monthly food and dining expenses"
            },
            {
                "name": "Transportation Budget",
                "category": "Transportation",
                "amount": 400.0,
                "period": "monthly", 
                "description": "Gas, rides, and transport costs"
            },
            {
                "name": "Shopping Budget",
                "category": "Shopping",
                "amount": 300.0,
                "period": "monthly",
                "description": "General shopping and purchases"
            },
            {
                "name": "Utilities Budget", 
                "category": "Utilities",
                "amount": 250.0,
                "period": "monthly",
                "description": "Electricity, internet, phone bills"
            },
            {
                "name": "Housing Budget",
                "category": "Housing", 
                "amount": 1800.0,
                "period": "monthly",
                "description": "Rent and housing costs"
            },
            {
                "name": "Entertainment Budget",
                "category": "Entertainment",
                "amount": 200.0,
                "period": "monthly", 
                "description": "Movies, streaming, fun activities"
            },
            {
                "name": "Healthcare Budget",
                "category": "Healthcare",
                "amount": 150.0,
                "period": "monthly",
                "description": "Medical expenses and pharmacy"
            }
        ]
        
        # Set start date to 6 months ago to include all our sample transactions
        start_date = datetime.now() - timedelta(days=180)
        end_date = datetime.now() + timedelta(days=30)  # Budget extends into next month
        
        budgets = []
        for budget_info in budget_data:
            budget = {
                "user_id": user_id,
                "name": budget_info["name"],
                "amount": budget_info["amount"],
                "category": budget_info["category"],
                "period": budget_info["period"],
                "start_date": start_date,
                "end_date": end_date,
                "description": budget_info["description"],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            budgets.append(budget)
        
        # Insert budgets
        result = await db.budgets.insert_many(budgets)
        
        print(f"✅ Created {len(result.inserted_ids)} budgets:")
        for budget_info in budget_data:
            print(f"   📊 {budget_info['category']}: ${budget_info['amount']}/month")
        
        print(f"\n📅 Budget period: {start_date.date()} to {end_date.date()}")
        print(f"🎯 Now the budget progress should calculate correctly!")
        
        client.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("🎯 Adding Sample Budgets")
    print("========================")
    if USE_HARDCODED_USER:
        print(f"🎯 Target user: {HARDCODED_USER['email']}")
    else:
        print("🎯 Using first available user")
    print()
    asyncio.run(add_sample_budgets())
    print("\n✅ Done! Check the budget page to see progress updates.")
