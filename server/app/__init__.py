from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS


db = SQLAlchemy()        
jwt = JWTManager()      

def create_app():
    app = Flask(__name__)

    # claves secretas
    app.config['SECRET_KEY'] = 'esta-es-una-clave-secreta'          
    app.config['JWT_SECRET_KEY'] = 'clave-secreta-jwt'              

    # base de datos SQLite
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todolist.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False            # Para evitar warnings innecesarios


    CORS(app)

    db.init_app(app)
    jwt.init_app(app)

    from app.auth import auth_bp
    from app.tasks import tasks_bp

   
    app.register_blueprint(auth_bp, url_prefix='/auth')   
    app.register_blueprint(tasks_bp, url_prefix='/tasks') 
    
    with app.app_context():
        db.create_all()


    return app
