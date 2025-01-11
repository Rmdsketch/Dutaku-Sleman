from flask_restful import Api
from resources.user import UserRoute
from resources.auth import Login, Register
from resources.criteria import CriteriaRoute
from resources.alternative import AlternativeRoute
from resources.calculate import CalculateRoute
from resources.saw import SawRoute

def config_routes(app):
    api = Api()
    api.add_resource(
        UserRoute,
        "/users",
        "/users/<int:identifier>",
        methods=["GET", "POST", "DELETE", "PUT", "PATCH"],
    )
    api.add_resource(
        CriteriaRoute,
        "/criterias",
        "/criterias/<string:identifier>",
        methods=["GET", "POST", "DELETE", "PUT", "PATCH"],
    )
    api.add_resource(
        AlternativeRoute,
        "/alternatives",
        "/alternatives/<string:identifier>",
        methods=["GET", "POST", "DELETE", "PUT", "PATCH"],
    )
    api.add_resource(
        CalculateRoute,
        "/calculates",
        "/calculates/<string:identifier>",
        methods=["GET", "POST", "DELETE", "PATCH"],
    )
    api.add_resource(SawRoute, "/saw")

    # Endpoint auth
    api.add_resource(Login, "/auth/login")
    api.add_resource(Register, "/auth/register")

    api.init_app(app)