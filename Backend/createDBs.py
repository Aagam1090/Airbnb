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

def insert_data_into_tables(city_path, connection):
    # Assume city_path is the directory containing both listings.csv and reviews.csv
    listings_file = os.path.join(city_path, "listings.csv")
    reviews_file = os.path.join(city_path, "reviews.csv")

    listings_dtype_spec = {
        'id': str,
        'name': str,
        'host_location': str,
        'property_type': str,
        'accommodates': int,
        'bathrooms': str,
        'beds': float,
        'price': str,
        'review_scores_rating': float
    }

    reviews_dtype_spec = {
        'id': str,
        'comments': str
    }

    try:
        # Load and process listings data
        df_listings = pd.read_csv(listings_file, dtype=listings_dtype_spec)
        # Assuming 'amenities' is stored as a JSON-like string and needs special handling
        df_listings['amenities'] = df_listings['amenities'].apply(json.loads)
        df_listings = df_listings.replace(np.nan, None)  # Replace NaN with None

        # Load and process reviews data
        df_reviews = pd.read_csv(reviews_file, dtype=reviews_dtype_spec)
        df_reviews.replace(np.nan, None)

        # Insert listings data into database
        with connection.cursor() as cur:
            for _, row in df_listings.iterrows():
                columns = ', '.join(row.index)
                placeholders = ', '.join(['%s'] * len(row))
                sql = f"INSERT INTO listings ({columns}) VALUES ({placeholders}) ON CONFLICT (id) DO NOTHING;"
                cur.execute(sql, tuple(row))

            print("Listings data inserted successfully.")
            
            for _, row in df_reviews.iterrows():
                cur.execute("INSERT INTO reviews (id, reviewer_id, reviewer_name, comments) VALUES (%s, %s, %s, %s) ON CONFLICT (id) DO NOTHING;", (row['id'], row['reviewer_id'], row['reviewer_name'], row['comments']))
                
                cur.execute("INSERT INTO listings_reviews (listing_id, review_id) VALUES (%s, %s) ON CONFLICT DO NOTHING;", (row['listing_id'], row['id']))
            
            print("Reviews data inserted successfully.")
            
            connection.commit()

    except Exception as e:
        print(f"Failed to insert data into database: {e}")
        connection.rollback()  # Roll back the transaction on error

def setup_schema_and_tables(user, password, host, city_path, city_db):
    # Define the connection parameters for the new city database
    db_params = {
        "database": city_db.lower().replace(' ', '_').replace('-', '_'),
        "user": user,
        "password": password,
        "host": host
    }

    conn = psycopg2.connect(**db_params)
    with conn.cursor() as cursor:
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS listings (
                id TEXT PRIMARY KEY,
                name TEXT,
                host_location VARCHAR(255),
                property_type VARCHAR(255), 
                accommodates INT, 
                bathrooms_text VARCHAR(255), 
                beds FLOAT, 
                amenities TEXT[], 
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
        insert_data_into_tables(city_path, conn)
    conn.close()

def create_cities_table(dbname, user, password, host):
    try:
        conn = psycopg2.connect(database=dbname, user=user, password=password, host=host)
        cursor = conn.cursor()
        # Create table if not exists within the Cities schema
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS city_info (
                city_name VARCHAR(255) PRIMARY KEY,
                db_name VARCHAR(255)
            )
        """)

        # Loop through files in the directory
        for folder_name in os.listdir(directory_path):
            folder_path = os.path.join(directory_path, folder_name)
            if os.path.isdir(folder_path):
                city_name = folder_name  # The folder name is the city name
                db_name = folder_name.lower().replace(' ', '_').replace('-', '_')
                
                # Insert data into the database
                cursor.execute('INSERT INTO city_info (city_name, db_name) VALUES (%s, %s) ON CONFLICT (city_name) DO NOTHING', (city_name, db_name))

        # Commit changes and close the connection
        conn.commit()
        cursor.close()
        conn.close()
        print("Data successfully inserted and schema set up.")

    except Exception as e:
        print(f"Failed to insert data into the city database: {e}")

if __name__ == "__main__":
    # Database connection parameters
    host = "localhost"
    user = "postgres"
    password = "toor"

    directory_path = 'Citywise_Data'

    create_database("cities", user, password, host)
    create_cities_table("cities", user, password, host)

    for city in os.listdir(directory_path):
        city_path = os.path.join(directory_path, city)
        if os.path.isdir(city_path):
            city_db = city.lower().replace(' ', '_').replace('-', '_')
            create_database(city_db, user, password, host)  # Create a new database for each city
            setup_schema_and_tables(user, password, host, city_path, city_db)  # Setup tables in the new city database

