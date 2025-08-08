from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import Optional

# Configuration
MONGO_DETAILS = "mongodb://localhost:27017" # Update with your MongoDB connection string
DATABASE_NAME = "charity_db"

app = FastAPI()

# CORS Middleware (important for connecting frontend and backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace "*" with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = AsyncIOMotorClient(MONGO_DETAILS)
    app.mongodb = app.mongodb_client[DATABASE_NAME]

@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()

# Models
class Donation(BaseModel):
    amount: float = Field(..., gt=0)
    name: str
    email: str
    message: Optional[str] = None
    type: str

class Sponsorship(BaseModel):
    amount: float = Field(..., gt=0)
    name: str
    email: str
    message: Optional[str] = None
    child_id: str

class Newsletter(BaseModel):
    email: str

# Endpoints
@app.post("/donations")
async def create_donation(donation: Donation):
    donation_collection = app.mongodb.donations
    result = await donation_collection.insert_one(donation.dict())
    return {"message": "Donation created successfully", "id": str(result.inserted_id)}

@app.post("/sponsorships")
async def create_sponsorship(sponsorship: Sponsorship):
    sponsorship_collection = app.mongodb.sponsorships
    result = await sponsorship_collection.insert_one(sponsorship.dict())
    return {"message": "Sponsorship created successfully", "id": str(result.inserted_id)}

@app.post("/newsletter")
async def subscribe_newsletter(newsletter: Newsletter):
    newsletter_collection = app.mongodb.newsletter
    result = await newsletter_collection.insert_one(newsletter.dict())
    return {"message": "Subscription successful", "id": str(result.inserted_id)}

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI Backend!"}