from config import ma
from models.user import User
from marshmallow import validates, ValidationError

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        
    password = ma.auto_field(load_only=True)

    @validates("email")
    def validate_email(self, email, **kwargs):
        if "@" not in email:
            raise ValidationError("Format email tidak valid")
        return email

    @validates("password")
    def validate_password(self, password, **kwargs):
        if len(password) < 8:
            raise ValidationError("Password minimal 8 karakter")
        return password

user_schema = UserSchema()
users_schema = UserSchema(many=True)