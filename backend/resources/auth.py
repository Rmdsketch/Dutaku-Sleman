from flask_restful import Resource
from flask import request
from flask_jwt_extended import create_access_token
from datetime import timedelta
from models.user import User, Role
from schemas.user import user_schema
from config import db

class Login(Resource):
    def post(self):
        json_data = request.get_json()
        if not json_data:
            return {"message": "Validasi gagal", "errors": {"Tidak ada data!"}}, 400

        username = json_data.get("username")
        password = json_data.get("password")

        if not username or not password:
            return {"message": "Error: username dan password harus diisi!"}, 400

        user = User.query.filter_by(username=username).first()
        if not user:
            return {
                "message": "Akun belum terdaftar. Silakan daftar terlebih dahulu!"
            }, 401
        if not user.check_password(password):
            return {"message": "Error: username atau password salah!"}, 401

        token = create_access_token(
            identity={"id": user.id, "username": user.username, "role": user.role},
            expires_delta=timedelta(minutes=10),
        )

        return {
            "token": token,
            "username": user.username,
            "role": user.role,
        }, 200


class Register(Resource):
    def post(self):
        json_data = request.get_json()
        if not json_data:
            return {"message": "Validasi gagal", "errors": {"Data tidak ada!"}}, 400

        errors = user_schema.validate(json_data)
        if errors:
            return {"message": "Validasi gagal", "errors": errors}, 400

        if User.query.filter_by(username=json_data["username"]).first():
            return {
                "message": "Validasi gagal",
                "error": {"username": "Username sudah digunakan"},
            }, 400
        if User.query.filter_by(email=json_data["email"]).first():
            return {
                "message": "Validasi gagal",
                "error": {"email": "Email sudah digunakan"},
            }, 400
        if json_data["role"].capitalize() not in Role.__members__:
            return {
                "message": "Validasi gagal",
                "errors": {
                    "role": "Role tidak valid. Pilih salah satu: Admin atau Juri"
                },
            }, 400

        user = User(
            username=json_data["username"],
            email=json_data["email"],
            password=json_data["password"],
            role=json_data["role"],
        )
        db.session.add(user)
        db.session.commit()
        result = user_schema.dump(user)

        return {"status": "Pendaftaran Berhasil!", "data": result}, 201
