from sqlalchemy import Enum
from flask_bcrypt import Bcrypt
from config import db
from enum import Enum as PyEnum

bcrypt = Bcrypt()

class Role(PyEnum):
    Admin = "Admin"
    Juri = "Juri"

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(64), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)
    role = db.Column(Enum(*[role.value for role in Role], name="role_enum"), nullable=False,)

    def __init__(self, username, email, password, role):
        self.username = username
        self.email = email
        self.set_password(password)
        self.role = role

    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode("utf-8")

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)