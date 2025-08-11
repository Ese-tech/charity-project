# charity-project

##Install dependencies and seed the database:

- Run the seeding script from your terminal to populate your database with the new story data:

 Bash

 pip install -r requirements.txt
 python seed.py

- Confirm the virtual environment is still active. Your prompt should still show (venv). If it doesn't, activate it again:

 Bash

 source venv/bin/activate 

- Restart your FastAPI server so it can connect to the database with the new data:

 Bash

 uvicorn main:app --reload
