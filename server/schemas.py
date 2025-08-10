# server/schemas.py
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Literal
from bson import ObjectId
from pydantic_core import PydanticCustomError, core_schema
from enum import Enum

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
        json_encoders = {ObjectId: str}
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
# New: Define a Python Enum for payment methods
class PaymentMethod(str, Enum):
    credit_card = "credit_card"
    debit_card = "debit_card"
    paypal = "paypal"
    mobile_money = "mobile_money"

# Updated Donation class to match frontend payload and new features
class Donation(BaseModel):
    firstName: str
    lastName: str
    email: str
    phone: Optional[str] = None
    # Conditional fields based on category
    amount: Optional[float] = None
    currency: Optional[str] = None
    item_type: Optional[str] = None
    description: Optional[str] = None
    type: Literal['monthly', 'one-time']
    category: Literal['general', 'disaster', 'sponsor', 'items'] # <-- ADDED 'items'
    paymentMethod: Optional[PaymentMethod] = None # Use the new enum here
    childId: Optional[str] = None

# Corrected SponsorshipData model to make childId optional
class SponsorshipData(BaseModel):
    first_name: str = Field(alias="firstName")
    last_name: str = Field(alias="lastName")
    email: str
    # Making child_id optional by providing a default value of None
    child_id: Optional[str] = Field(None, alias="childId")
    monthly_amount: float = Field(alias="monthlyAmount")
    payment_method: PaymentMethod = Field(alias="paymentMethod") # Using the new enum
    currency: str = Field(alias="currency")


    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Story(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    title: str
    content: str
    imageUrl: str
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        json_schema_extra = {
            "example": {
                "id": "60c72b2f9b1d8e001f8e4e9b",
                "title": "A Community Transformed",
                "content": "Thanks to our sponsors, we built a new well, providing clean water to the entire village.",
                "imageUrl": "https://images.unsplash.com/photo-1542315099045-93937d70c67a"
            }
        }