import psycopg2
import pandas as pd
import numpy as np  
import json
import os

def create_database(dbname, user, password, host):
    conn = psycopg2.connect(database="postgres", user=user, password=password, host=host)
    conn.autocommit = True  # Enable autocommit for database creation
    cursor = conn.cursor()
    try:
        cursor.execute(f"SELECT 1 FROM pg_database WHERE datname = '{dbname}'")
        if cursor.fetchone() is None:
            cursor.execute(f"CREATE DATABASE {dbname}")
            print(f"Database {dbname} created successfully.")
        else:
            print(f"Database {dbname} already exists.")
    except Exception as e:
        print(f"Failed to create database {dbname}: {e}")
    finally:
        cursor.close()
        conn.close()

def insert_data_from_csv(file_path, table_name, connection):
    # dtype_spec = {
    #     'id': str,
    #     'name': str,
    #     'host_location': str,
    #     'property_type': str,
    #     'accommodates': int,
    #     'bathrooms': str,
    #     'beds': int,
    #     'price': float,
    #     'review_scores_rating': float
    # }
    data = pd.read_csv(file_path)
    print(data)
    data['amenities'] = data['amenities'].apply(json.loads)  # Assuming amenities are stored as valid JSON strings in CSV

    # Replace all NaN values with None
    data = data.replace(np.nan, None)  # Directly set NaNs to None
    columns = ', '.join(data.columns)
    placeholders = ', '.join(['%s'] * len(data.columns))

    # Customize the below SQL query based on your database schema
    for index, row in data.iterrows():
        cur = connection.cursor()

        try:
            if isinstance(row['amenities'], str):
                row['amenities'] = json.loads(row['amenities'])
            cur.execute(f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders}) ON CONFLICT (id) DO NOTHING;", tuple(row))
            connection.commit()
        except Exception as e:
            print(f"Failed to insert data: {e}")
            connection.rollback()  # Roll back the transaction on error
        finally:
            cur.close()

def setup_schema_and_tables(user, password, host, city, city_schema):
    # Define the connection parameters for the new city database
    db_params = {
        "database": city_schema.lower().replace(' ', '_').replace('-', '_'),
        "user": user,
        "password": password,
        "host": host
    }

    conn = psycopg2.connect(**db_params)
    with conn.cursor() as cursor:
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS listings (
                id VARCHAR(255) PRIMARY KEY,
                name TEXT,
                host_location VARCHAR(255),
                property_type VARCHAR(255), 
                accommodates INT, 
                bathrooms_text VARCHAR(255), 
                beds INT, 
                amenities TEXT[], 
                price FLOAT, 
                review_scores_rating FLOAT
            );
            CREATE TABLE IF NOT EXISTS reviews (
                id VARCHAR(255) PRIMARY KEY,
                listing_id VARCHAR(255),
                reviewer_id VARCHAR(255),
                reviewer_name TEXT,
                comments TEXT,
                FOREIGN KEY (listing_id) REFERENCES listings(id)
            );
        """)
        conn.commit()
    conn.close()

if __name__ == "__main__":
    # Database connection parameters
    host = "localhost"
    user = "postgres"
    password = "toor"

    directory_path = '../Airbnb Data/'

    for city in os.listdir(directory_path):
        city_path = os.path.join(directory_path, city)
        if os.path.isdir(city_path):
            city_schema = city.lower().replace(' ', '_').replace('-', '_')
            create_database(city_schema, user, password, host)  # Create a new database for each city
            setup_schema_and_tables(user, password, host, city, city_schema)  # Setup tables in the new city database

