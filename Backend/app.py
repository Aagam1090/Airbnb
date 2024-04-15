from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user
import psycopg2

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'  # Replace with your secret key

CORS(app)

login_manager = LoginManager(app)

login_manager.init_app(app)

def get_db_connection(database_name):
    conn = psycopg2.connect(database=database_name, user="postgres", password="root", host="localhost")
    return conn

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
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = next((u for u in users if u.email == email and u.password == password), None)
    if user:
        login_user(user)
        return jsonify({'success': True, 'message': 'Logged in successfully!'}), 200
    else:
        return jsonify({'success': False, 'message': 'Invalid credentials!'}), 401

    
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    fullname = data.get('fullname')
    email = data.get('email')
    password = data.get('password')

    hashed_password = password

    new_user = User(id=len(users)+1, name=fullname, email=email, password=hashed_password)
    users.append(new_user)

    return jsonify({'success': True, 'message': 'Registered successfully!'}), 201

@app.route('/search', methods=['GET'])
def search_listing():
    query_params = request.args

    data = {key: query_params.getlist(key) if len(query_params.getlist(key)) > 1 else query_params[key] for key in query_params}

    sql = f"SELECT * FROM listings WHERE price >= {data['priceMin']} AND price <= {data['priceMax']}"

    if data['bedrooms'] != '':
        sql += f" AND beds = {data['bedrooms']}"

    if data['people'] != '':
        sql += f" AND accommodates = {data['people']}"

    if data['rating'] != '':
        sql += f" AND review_scores_rating >= {data['rating']}"

    if 'amenities' in data:
        # Iterate over each element in the amenities list
        for element in data['amenities']:
            # Add the LIKE condition for the current element to the SQL query
            sql += f" AND amenities LIKE '%{element}%' "

    db_name = data['city'].lower().replace(' ','_')
    conn = get_db_connection(db_name)
    cursor = conn.cursor() 
    cursor.execute(sql)
    rows = cursor.fetchall()

    # Transform the result into a list of dictionaries
    res = []
    columns = ['id', 'name', 'host_location', 'property_type', 'accommodates', 'bathrooms_text', 'beds', 'amenities', 'price', 'review_scores_rating']
    for row in rows:
        res.append({columns[i]: row[i] for i in range(len(columns))})

    return jsonify(res)

@app.route('/getCitites', methods=['GET'])
def get_cities():
    conn = get_db_connection("cities")
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT city_name FROM city_info")
        rows = cursor.fetchall()
        cities = [row[0] for row in rows]
    except Exception as e:
        print(f"Database query failed: {e}")
        cities = []
    finally:
        cursor.close()
        conn.close()
    return jsonify(cities)

if __name__ == '__main__':
    app.run(debug=True)
