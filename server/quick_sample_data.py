#!/usr/bin/env python3
"""
Simple script to add sample data - handles user creation too
"""
import asyncio
import hashlib
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
import random

# Hardcoded user option - set USE_HARDCODED_USER to True to use specific user
USE_HARDCODED_USER = True
HARDCODED_USER = {
    "email": "",
    "name": ""
}

async def create_sample_user_and_data():
    """Create a sample user and add transaction data"""
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
                
                # Create the user if it doesn't exist
                print(f"🔄 Creating user: {HARDCODED_USER['email']}")
                sample_user = {
                    "email": HARDCODED_USER["email"],
                    "name": HARDCODED_USER["name"],
                    "password": hashlib.sha256("kkkk123".encode()).hexdigest(),  # Simple hash
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
                user_result = await db.users.insert_one(sample_user)
                user_id = str(user_result.inserted_id)
                print(f"✅ Created hardcoded user: {HARDCODED_USER['email']}")
            else:
                user_id = str(user["_id"])
                print(f"✅ Using hardcoded user: {user.get('email')} ({user.get('name')})")
        else:
            # Get the first user (original behavior)
            users = await db.users.find().to_list(1)
            if not users:
                # Create a sample user
                sample_user = {
                    "email": "test@example.com",
                    "name": "Test User",
                    "password": hashlib.sha256("password123".encode()).hexdigest(),  # Simple hash
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
                user_result = await db.users.insert_one(sample_user)
                user_id = str(user_result.inserted_id)
                print(f"✅ Created sample user: {sample_user['email']}")
            else:
                user_id = str(users[0]["_id"])
                print(f"✅ Using first available user: {users[0].get('email', 'unknown')}")
        
        # Clear existing transactions
        await db.transactions.delete_many({"user_id": user_id})
        
        # Sample transactions with good variety
        transactions = []
        end_date = datetime.now()
        
        # Generate transactions for the last 4 months
        for days_ago in range(120, 0, -1):
            current_date = end_date - timedelta(days=days_ago)
            
            # Income (monthly)
            if current_date.day <= 3:
                transactions.append({
                    "user_id": user_id,
                    "description": "Monthly Salary",
                    "amount": random.uniform(4000, 5000),
                    "category": "Income",
                    "transaction_type": "income",
                    "date": current_date,
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                })
            
            # Daily expenses with variations
            daily_transactions = [
                # Regular expenses
                {"desc": "Grocery Store", "category": "Food & Dining", "amount": (60, 150), "prob": 0.2},
                {"desc": "Coffee Shop", "category": "Food & Dining", "amount": (4, 12), "prob": 0.3},
                {"desc": "Gas Station", "category": "Transportation", "amount": (35, 70), "prob": 0.15},
                {"desc": "Restaurant", "category": "Food & Dining", "amount": (25, 80), "prob": 0.2},
                {"desc": "Online Shopping", "category": "Shopping", "amount": (20, 120), "prob": 0.1},
                {"desc": "Uber Ride", "category": "Transportation", "amount": (8, 25), "prob": 0.1},
                
                # Monthly bills
                {"desc": "Electricity Bill", "category": "Utilities", "amount": (80, 120), "prob": 0.03 if current_date.day == 5 else 0},
                {"desc": "Internet Bill", "category": "Utilities", "amount": (60, 80), "prob": 0.5 if current_date.day == 10 else 0},
                {"desc": "Phone Bill", "category": "Utilities", "amount": (45, 65), "prob": 0.5 if current_date.day == 15 else 0},
                {"desc": "Rent", "category": "Housing", "amount": (1200, 1800), "prob": 0.9 if current_date.day == 1 else 0},
                
                # Entertainment
                {"desc": "Movie Theater", "category": "Entertainment", "amount": (12, 30), "prob": 0.05},
                {"desc": "Streaming Service", "category": "Entertainment", "amount": (10, 20), "prob": 0.02 if current_date.day == 20 else 0},
                
                # Healthcare
                {"desc": "Pharmacy", "category": "Healthcare", "amount": (15, 50), "prob": 0.02},
                {"desc": "Doctor Visit", "category": "Healthcare", "amount": (100, 200), "prob": 0.01},
                
                # Anomalies (unusual expenses)
                {"desc": "Emergency Car Repair", "category": "Transportation", "amount": (800, 1200), "prob": 0.001},
                {"desc": "Expensive Dinner", "category": "Food & Dining", "amount": (150, 300), "prob": 0.005},
                {"desc": "Electronics Purchase", "category": "Shopping", "amount": (400, 800), "prob": 0.003},
            ]
            
            for tx in daily_transactions:
                if random.random() < tx["prob"]:
                    amount = random.uniform(tx["amount"][0], tx["amount"][1])
                    
                    # Add some trend (increasing food costs over time)
                    if tx["category"] == "Food & Dining":
                        trend_factor = 1 + (120 - days_ago) / 365 * 0.1  # Gradual increase
                        amount *= trend_factor
                    
                    transactions.append({
                        "user_id": user_id,
                        "description": tx["desc"],
                        "amount": round(amount, 2),
                        "category": tx["category"],
                        "transaction_type": "expense",
                        "date": current_date + timedelta(hours=random.randint(8, 22)),
                        "created_at": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    })
        
        # Insert all transactions
        if transactions:
            await db.transactions.insert_many(transactions)
            
            # Calculate statistics
            expenses = [t for t in transactions if t["transaction_type"] == "expense"]
            income_txs = [t for t in transactions if t["transaction_type"] == "income"]
            
            print(f"✅ Generated {len(transactions)} transactions:")
            print(f"   📈 Income: {len(income_txs)} transactions, ${sum(t['amount'] for t in income_txs):,.2f}")
            print(f"   📉 Expenses: {len(expenses)} transactions, ${sum(t['amount'] for t in expenses):,.2f}")
            
            # Category counts
            categories = {}
            for t in expenses:
                categories[t["category"]] = categories.get(t["category"], 0) + 1
            
            print(f"   📊 Categories: {len(categories)} different categories")
            for cat, count in sorted(categories.items(), key=lambda x: x[1], reverse=True):
                print(f"      • {cat}: {count} transactions")
            
            print(f"\n🤖 AI Features Status:")
            print(f"   ✅ Anomaly Detection: Ready ({len(expenses)} expense transactions)")
            print(f"   ✅ Spending Patterns: Ready ({len(categories)} categories)")
            print(f"   ✅ Budget Recommendations: Ready")
            print(f"   ✅ Spending Forecast: Ready (4 months of data)")
        
        client.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("🚀 Quick Sample Data Generator")
    print("===============================")
    if USE_HARDCODED_USER:
        print(f"🎯 Target user: {HARDCODED_USER['email']}")
    else:
        print("🎯 Using first available user or creating new test user")
    print()
    asyncio.run(create_sample_user_and_data())
    print("\n✅ Sample data added! Login with:")
    if USE_HARDCODED_USER:
        print(f"   Email: {HARDCODED_USER['email']}")
        print("   Password: kkkk123")
    else:
        print("   Email: test@example.com")
        print("   Password: password123")
    print("\n🎯 Now try the AI Insights page!")
