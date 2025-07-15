from flask_jwt_extended import JWTManager

def config_auth(app):
    global jwt
    app.config["JWT_SECRET_KEY"] = (
        "78e9bc2793402c3117a056d1c781c4cae1a805c9c5700ce999d04a4e125c908d"
    )
    jwt = JWTManager(app)