from flask import Flask
from flask_cors import CORS
from config import db, config_database
from routes import config_routes
from auth import config_auth

def app_start():
    app = Flask(__name__)
    app.secret_key = "d64f6cbe0f595366364f0eb3fe72192a24eb967df1e85b5bc869ff7bdbc61f9b"
    CORS(app)
    config_routes(app)
    config_database(app)
    config_auth(app)
    
    with app.app_context():
        db.create_all() 
    return app

app = app_start()
if __name__ == "__main__":
    app.run(debug=True)