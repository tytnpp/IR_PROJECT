from flask import Flask
from flask_restful import Api, Resource
from .routes import search, auth, user
from flask_cors import CORS

app = Flask(__name__)

api = Api(app)
CORS(app, resources={r"/*": {"origins": "*"}})
api.add_resource(auth.JSONResponseAuthLogin,'/auth/login')
api.add_resource(auth.JSONResponseAuthRegister,'/auth/register')
api.add_resource(user.JSONResponseMe,'/auth/me')

api.add_resource(search.JSONResponseSearch,'/search')

# authenicationed
api.add_resource(user.JSONResponseBookmark,'/user/bookmark')
# api.add_resource(user.JSONResponseBookmarkAdd,'/user/bookmark/add')


if __name__=='__main__':
    app.run(debug=True)