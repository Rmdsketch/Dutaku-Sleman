from flask import Flask
from flask_cors import CORS
from config import db, config_database
from routes import config_routes
from auth import config_auth

def app_start():
    app = Flask(__name__)
    app.secret_key = "nestianakbaik"
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