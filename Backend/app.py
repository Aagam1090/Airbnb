from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'  # Replace with your secret key

CORS(app)

login_manager = LoginManager(app)

# User session management setup
login_manager.init_app(app)

# A simple user model (you may need to replace this with your database model)
class User(UserMixin):
    def __init__(self, id, name, email, password):
        self.id = id
        self.name = name
        self.email = email
        self.password = password

    def get_id(self):
        return self.id

# Dummy user (you should implement user lookup in your database)
users = [User(id=1, name='test', email='test@example.com', password='test123'), User(id=1, name = 'shalin',email='shalinbh@usc.edu', password='test123'), ]

# User loader
@login_manager.user_loader
def load_user(user_id):
    for user in users:
        if user.id == int(user_id):
            return user
    return None

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    print(email,password)
    # Placeholder for actual user retrieval from the database
    user = next((u for u in users if u.email == email), None)
    
    if user:
        login_user(user)
        return jsonify({'message': 'Logged in successfully!'}), 200
    else:
        return jsonify({'message': 'Invalid credentials!'}), 401
    
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    fullname = data.get('fullname')
    email = data.get('email')
    password = data.get('password')

    hashed_password = password

    new_user = User(id=len(users)+1, name=fullname, email=email, password=hashed_password)
    users.append(new_user)

    # Return success message
    return jsonify({'message': 'Registered successfully!'}), 201
if __name__ == '__main__':
    app.run()