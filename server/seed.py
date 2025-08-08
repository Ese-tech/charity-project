# seed.py
from pymongo import MongoClient

# MongoDB connection
MONGO_URI = "mongodb://localhost:27017/"
client = MongoClient(MONGO_URI)
db = client.charity_db
children_collection = db.children

# Sample children data with corrected field names and the 'is_sponsored' flag
children_data = [
    {
        "name": "Maria",
        "country": "Kenya",
        "age": 8,
        "photoUrl": "https://images.pexels.com/photos/3321798/pexels-photo-3321798.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "story": "Maria loves playing soccer and dreams of becoming a teacher.",
        "is_sponsored": False
    },
    {
        "name": "David",
        "country": "Nigeria",
        "age": 10,
        "photoUrl": "https://images.pexels.com/photos/10103440/pexels-photo-10103440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "story": "David is a curious boy who loves to read and learn about science.",
        "is_sponsored": False
    },
    {
        "name": "Fatima",
        "country": "Pakistan",
        "age": 7,
        "photoUrl": "https://images.pexels.com/photos/5623049/pexels-photo-5623049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "story": "Fatima is an artist who loves to draw and paint pictures of her village.",
        "is_sponsored": False
    }
]

# Delete any existing children and insert new data
children_collection.delete_many({})
children_collection.insert_many(children_data)
print("Database has been re-seeded with corrected sample children data.")
