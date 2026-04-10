from flask import Flask, jsonify
from flask_cors import CORS
from config import db, config_database
from routes import config_routes
from auth import config_auth
from limiter import limiter

def app_start():
    app = Flask(__name__)
    CORS(app)
    config_database(app)
    config_routes(app)
    config_auth(app)
    limiter.init_app(app)

    with app.app_context():
        db.create_all()
    return app

app = app_start()
if __name__ == "__main__":
    app.run(debug=True)