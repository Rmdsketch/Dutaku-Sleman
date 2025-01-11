from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

db = SQLAlchemy()
ma = Marshmallow()

def config_database(app):
    conn_str = "{DBMS}://{user}:{password}@{host}/{database}"
    app.config["SQLALCHEMY_DATABASE_URI"] = conn_str.format(
        DBMS="mysql+pymysql",
        user="root",
        password="",
        host="localhost",
        database="spk_duta_pariwisata",
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    with app.app_context():
        db.create_all()