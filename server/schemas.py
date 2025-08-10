# server/schemas.py
from pydantic import BaseModel, Field
from typing import Optional, List
from bson import ObjectId
from pydantic_core import PydanticCustomError, core_schema
from typing import Literal

# Helper class to handle MongoDB's ObjectId
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


# Corrected Child model with alias for '_id' and updated field names
class Child(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    country: str
    age: int
    photoUrl: str
    story: str
    isSponsored: Optional[bool] = Field(False, alias="is_sponsored") # Added isSponsored

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str} # <-- ADD THIS LINE
        json_schema_extra = {
            "example": {
                "id": "60c72b2f9b1d8e001f8e4e9a",
                "name": "Maria",
                "country": "Kenya",
                "age": 8,
                "photoUrl": "https://example.com/maria.jpg",
                "story": "Maria loves playing soccer and dreams of becoming a teacher."
            }
        }

# Updated Donation class to match frontend payload
class Donation(BaseModel):
    firstName: str
    lastName: str
    email: str
    phone: Optional[str] = None
    amount: float
    currency: str
    type: Literal['monthly', 'one-time']
    category: Literal['general', 'disaster', 'sponsor']
    paymentMethod: str
    childId: Optional[str] = None

# Corrected SponsorshipData model to match your frontend payload
# Corrected SponsorshipData model
class SponsorshipData(BaseModel):
    first_name: str = Field(alias="firstName")
    last_name: str = Field(alias="lastName")
    email: str
    child_id: str = Field(alias="childId")
    monthly_amount: float = Field(alias="monthlyAmount")

    class Config:
        populate_by_name = True

class Story(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    title: str
    content: str
    imageUrl: str
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str} # <-- ADD THIS LINE
        json_schema_extra = {
            "example": {
                "id": "60c72b2f9b1d8e001f8e4e9b",
                "title": "A Community Transformed",
                "content": "Thanks to our sponsors, we built a new well, providing clean water to the entire village.",
                "imageUrl": "https://images.unsplash.com/photo-1542315099045-93937d70c67a"
            }
        }