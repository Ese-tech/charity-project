# main.py

from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from pydantic import BaseModel, Field
from bson import ObjectId
from typing import List, Optional

# --- Assume your existing imports and database setup are here ---
# e.g., app = FastAPI(), client = MongoClient(...)

# Pydantic model for the child data
# We use ObjectId for the ID and then convert it to a string for the API response.
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class Child(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    country: str
    age: int
    # Add other fields you have for a child here

    class Config:
        json_encoders = {ObjectId: str}
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "name": "Maria",
                "country": "Kenya",
                "age": 8,
            }
        }

# --- New endpoint to get all children ---
@app.get("/children/", response_model=List[Child])
async def get_children():
    children_collection = db.children  # Assuming 'db' is your MongoDB database instance
    children = []
    async for child_data in children_collection.find():
        children.append(Child(**child_data))
    return children

# --- If you want to get a single child by ID ---
@app.get("/children/{child_id}", response_model=Child)
async def get_child(child_id: str):
    children_collection = db.children
    if not ObjectId.is_valid(child_id):
        raise HTTPException(status_code=400, detail="Invalid child ID")

    child_data = await children_collection.find_one({"_id": ObjectId(child_id)})
    if child_data:
        return Child(**child_data)
    raise HTTPException(status_code=404, detail="Child not found")