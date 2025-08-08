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

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
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
class SponsorshipData(BaseModel):
    firstName: str
    lastName: str
    email: str
    childId: str
    monthlyAmount: float