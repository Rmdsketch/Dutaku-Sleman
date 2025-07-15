from config import ma
from models.user import User
from marshmallow import validates, ValidationError

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User

    @validates("email")
    def validate_email(self, email):
        if "@" not in email:
            raise ValidationError("Format email tidak valid")

    @validates("password")
    def validate_password(self, password):
        if len(password) < 8:
            raise ValidationError("Password minimal 8 karakter")

user_schema = UserSchema()
users_schema = UserSchema(many=True)