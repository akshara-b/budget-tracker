from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings

# Global database client
client: AsyncIOMotorClient = None

async def connect_to_mongo():
    """Create database connection."""
    global client
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    print("Connected to MongoDB.")

async def close_mongo_connection():
    """Close database connection."""
    global client
    if client:
        client.close()
        print("Disconnected from MongoDB.")

def get_database():
    """Get database instance."""
    if client is None:
        raise RuntimeError("Database not connected. Call connect_to_mongo() first.")
    return client[settings.DATABASE_NAME]

async def init_db():
    """Initialize database with indexes and collections."""
    db = get_database()
    
    # Create indexes for better performance
    await db.users.create_index("username", unique=True)
    await db.users.create_index("email", unique=True)
    await db.transactions.create_index([("user_id", 1), ("date", -1)])
    await db.transactions.create_index([("user_id", 1), ("category", 1)])
    await db.transactions.create_index([("user_id", 1), ("transaction_type", 1)])
    await db.budgets.create_index([("user_id", 1), ("category", 1)])
    
    print("Database indexes created successfully.")
