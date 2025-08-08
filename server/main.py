# server/main.py
from fastapi import FastAPI, HTTPException, status, APIRouter, Query
from pymongo import MongoClient
from pydantic import BaseModel, Field
from bson import ObjectId
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
# Corrected import statement to include 'Story'
from schemas import Child, Donation, SponsorshipData, PyObjectId, Story

# Initialize FastAPI app
app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URI = "mongodb://localhost:27017/"
client = MongoClient(MONGO_URI)
db = client.charity_db

# Initialize collections globally
children_collection = db.children
donations_collection = db.donations
sponsorships_collection = db.sponsorships

# API endpoints
@app.get("/")
def read_root():
    return {"message": "Welcome to the Charity Project API"}

@app.get("/children", response_model=List[Child])
def get_children():
    children = []
    for child_data in children_collection.find():
        children.append(Child(**child_data))
    return children

@app.get("/children/available", response_model=list[Child])
def get_available_children(limit: int = 12, region: Optional[str] = None):
    """
    Retrieve a list of children available for sponsorship.
    """
    children = []
    
    # Building the query based on parameters
    query = {"is_sponsored": False}
    if region:
        query["region"] = region
    
    cursor = children_collection.find(query).limit(limit)
    
    for child_data in cursor:
        children.append(Child(**child_data))
        
    return children

@app.get("/children/{child_id}", response_model=Child)
def get_child(child_id: str):
    if not ObjectId.is_valid(child_id):
        raise HTTPException(status_code=400, detail="Invalid child ID")
    child_data = children_collection.find_one({"_id": ObjectId(child_id)})
    if child_data:
        return Child(**child_data)
    raise HTTPException(status_code=404, detail="Child not found")

@app.post("/donations", status_code=status.HTTP_201_CREATED)
def create_donation(donation: Donation):
    print(f"Received donation: {donation.model_dump()}")
    donations_collection.insert_one(donation.model_dump(by_alias=True))
    return {"message": "Donation successful!"}

@app.post("/sponsorships", status_code=status.HTTP_201_CREATED)
def create_sponsorship(sponsorship_data: SponsorshipData):
    print(f"Received sponsorship for child: {sponsorship_data.child_id}")
    # The .model_dump(by_alias=True) ensures the data is saved with the original keys
    # from the frontend, which might be helpful if you want to inspect them.
    sponsorships_collection.insert_one(sponsorship_data.model_dump(by_alias=True))
    return {"message": "Sponsorship created successfully", "data": sponsorship_data}

@app.get("/children/featured", response_model=Child)
def get_featured_child():
    """
    Retrieve a single featured child for the homepage.
    """
    child_data = children_collection.find_one({"is_sponsored": False})
    if child_data:
        return Child(**child_data)
    raise HTTPException(status_code=404, detail="No featured child found")

@app.get("/stories", response_model=List[Story])
def get_stories():
    """
    Retrieve a list of all stories.
    """
    stories = []
    for story_data in stories_collection.find():
        stories.append(Story(**story_data))
    return stories