from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from pydantic import BaseModel, Field
from bson import ObjectId
from typing import List, Optional
from pydantic_core import PydanticCustomError, core_schema
from fastapi.middleware.cors import CORSMiddleware

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
# Assume you have a .env file with your MONGO_URI
# from dotenv import load_dotenv
# load_dotenv()
# MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
MONGO_URI = "mongodb://localhost:27017/" # Use this for local development if no .env
client = MongoClient(MONGO_URI)
db = client.charity_db

# Pydantic models for data validation
class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, _source_type: any, _handler: any
    ) -> core_schema.CoreSchema:
        return core_schema.union_schema(
            [
                core_schema.is_instance_schema(ObjectId),
                core_schema.no_info_after_validator_function(
                    cls.validate,
                    core_schema.str_schema(),
                ),
            ],
            serialization=core_schema.to_string_ser_schema(),
        )

    @classmethod
    def validate(cls, v):
        if not isinstance(v, (ObjectId, str)):
            raise PydanticCustomError('invalid_type', 'ObjectId required')
        if isinstance(v, str) and not ObjectId.is_valid(v):
            raise PydanticCustomError('invalid_objectid', 'Invalid ObjectId')
        return ObjectId(v)

class Child(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    country: str
    age: int
    photo_url: Optional[str] = None
    bio: Optional[str] = None

    class Config:
        validate_by_name = True
        json_schema_extra = {
            "example": {
                "name": "Maria",
                "country": "Kenya",
                "age": 8,
                "photo_url": "https://example.com/maria.jpg",
                "bio": "Maria loves playing soccer and dreams of becoming a teacher."
            }
        }

# API endpoints
@app.get("/")
def read_root():
    return {"message": "Welcome to the Charity Project API"}

@app.get("/children/", response_model=List[Child])
async def get_children():
    children_collection = db.children
    children = []
    for child_data in children_collection.find():
        children.append(Child(**child_data))
    return children

@app.get("/children/{child_id}", response_model=Child)
async def get_child(child_id: str):
    children_collection = db.children
    if not ObjectId.is_valid(child_id):
        raise HTTPException(status_code=400, detail="Invalid child ID")
    child_data = children_collection.find_one({"_id": ObjectId(child_id)})
    if child_data:
        return Child(**child_data)
    raise HTTPException(status_code=404, detail="Child not found")