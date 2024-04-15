import uuid
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user
from psycopg2 import sql
import psycopg2

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'  # Replace with your secret key

CORS(app)
globalUser = None
login_manager = LoginManager(app)

login_manager.init_app(app)

def get_db_connection(database_name):
    conn = psycopg2.connect(database=database_name, user="postgres", password="admin", host="localhost")
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
users = [User(id=1, name='test', email='test@example.com', password='test123'), User(id=12345, name = 'shalin',email='shalinbh@usc.edu', password='test123'), ]

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
        globalUser = user
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

    # print(data['city'])
    return jsonify(data)

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

@app.route('/insert', methods=['POST'])
def insert_property():
    data = request.get_json()
    city = data.get('city') 
    conn = get_db_connection("cities")

    try:
        # Ensure the city exists in city_info and get db_name
        if city.lower() == "other":
            city = data['otherCity']
            db_name = create_city_database(conn, city)
            conn.close()  

        db_name = city.lower().replace(' ', '_').replace('-', '_')
        conn = get_db_connection(db_name)
        insert_property_data(data, conn)

        return jsonify({'success': True, 'message': 'Property inserted successfully!'}), 201
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        if conn:
            conn.close()

def create_city_database(conn, city):
    with conn.cursor() as cur:
        db_name = city.lower().replace(' ', '_').replace('-', '_')
        cur.execute("INSERT INTO city_info (city_name, db_name) VALUES (%s, %s)", (city, db_name))
        conn.commit()
        create_new_city_database(db_name)
        return db_name

def create_new_city_database(db_name):

    conn1 = psycopg2.connect(database="postgres", user="postgres", password="admin", host="localhost")
    conn1.autocommit = True
    cursor = conn1.cursor()
    try:
        cursor.execute(f"SELECT 1 FROM pg_database WHERE datname = '{db_name}'")
        if cursor.fetchone() is None:
            cursor.execute(f"CREATE DATABASE {db_name}")
            print(f"Database {db_name} created successfully.")
        else:
            print(f"Database {db_name} already exists.")
    except Exception as e:
        print(f"Failed to create database {db_name}: {e}")
    finally:
        cursor.close()
        conn1.close()

    # Connect to the new database and set up schema
    conn = get_db_connection(db_name)
    setup_schema(conn)
    conn.close()

def setup_schema(conn):
    with conn.cursor() as cur:
        cur.execute("""
            CREATE TABLE IF NOT EXISTS listings (
                id TEXT PRIMARY KEY,
                name TEXT,
                host_location VARCHAR(255),
                property_type VARCHAR(255), 
                accommodates INT, 
                bathrooms_text VARCHAR(255), 
                beds FLOAT, 
                amenities TEXT, 
                price VARCHAR(255), 
                review_scores_rating FLOAT
            );
            CREATE TABLE IF NOT EXISTS reviews (
                id TEXT PRIMARY KEY,
                reviewer_id TEXT,
                reviewer_name TEXT,
                comments TEXT
            );
            CREATE TABLE IF NOT EXISTS listings_reviews (
                listing_id TEXT,
                review_id TEXT,
                PRIMARY KEY (listing_id, review_id)
            );
        """)
        conn.commit()

def insert_property_data(data, conn):
    # Generate unique IDs for listing and review
    listing_id = str(uuid.uuid4())
    review_id = "1234567"
    # print(listing_id,review_id)
    # print(data['name'])
    with conn.cursor() as cur:
        # Insert into listings
        
        cur.execute("""
            INSERT INTO listings (id, name, host_location, property_type, accommodates, bathrooms_text, beds, amenities, price, review_scores_rating)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            listing_id,
            data['name'],
            data['location'],  
            data['propertyType'],
            str(data['guests']),  # Assuming guests maps to accommodates
            str(data['bathrooms'])+" baths",  # Defaulting beds to 1 if not provided
            str(data['bedrooms']),
            data['amenities'],
            float(data['price']),
            float(data['rating'])  # Assuming rating maps to review_scores_rating
        ))
        # print("Listings data inserted successfully.")
        # Insert into reviews
        cur.execute("""
            INSERT INTO reviews (id, reviewer_id, reviewer_name, comments)
            VALUES (%s, %s, %s, %s)
        """, (
            listing_id,
            review_id,
            "default_reviewer",  # Placeholder if not provided
            data['review']
        ))

        # Insert into listings_reviews linking table
        cur.execute("""
            INSERT INTO listings_reviews (listing_id, review_id)
            VALUES (%s, %s)
        """, (listing_id, review_id))

        conn.commit()


if __name__ == '__main__':
    app.run(debug=False)
