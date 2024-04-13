import psycopg2
import pandas as pd
import numpy as np  
import json

def create_database(dbname, user, password, host):
    try:
        # Connect to the default database
        conn = psycopg2.connect(database="postgres", user=user, password=password, host=host)
        conn.autocommit = True  # Needed to execute database creation command outside of a transaction
        cursor = conn.cursor()
        cursor.execute(f"CREATE DATABASE {dbname}")
        cursor.close()
        conn.close()
        print(f"Database {dbname} created successfully.")
    except Exception as e:
        print(f"Failed to create database {dbname}: {e}")


def insert_data_from_csv(file_path, table_name, connection):
    dtype_spec = {
        'listing_id': str,
        'name': str,
        'host_id': str,
        'host_since': str,
        'host_location': str,
        'host_response_time': str,
        'host_response_rate': float,
        'host_acceptance_rate': float,
        'host_total_listings_count': float,
        'neighbourhood': str,
        'district': str,
        'latitude': float,
        'longitude': float,
        'property_type': str,
        'room_type': str,
        'accommodates': int,
        'bedrooms': float,
        'price': int,
        'minimum_nights': int,
        'maximum_nights': int,
        'review_scores_rating': float,
        'review_scores_accuracy': float,
        'review_scores_cleanliness': float,
        'review_scores_checkin': float,
        'review_scores_communication': float,
        'review_scores_location': float,
        'review_scores_value': float,
        'host_is_superhost': str,
        'host_has_profile_pic': str,
        'host_identity_verified': str,
        'instant_bookable': str
    }
    data = pd.read_csv(file_path, dtype=dtype_spec)
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
            cur.execute(f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders}) ON CONFLICT (listing_id) DO NOTHING;", tuple(row))
            connection.commit()
        except Exception as e:
            print(f"Failed to insert data: {e}")
            connection.rollback()  # Roll back the transaction on error
        finally:
            cur.close()

def setup_schema_and_tables(db_params, files):
    try:
        conn = psycopg2.connect(**db_params)
        cursor = conn.cursor()
        # Create schema
        cursor.execute("CREATE SCHEMA IF NOT EXISTS Listings")
        conn.commit()

        for city, file_path in files.items():
            table_name = f"Listings.{city.lower().replace(' ', '_')}"  # Schema qualified table name
            # Create table if not exists
            cursor.execute(f"""
                CREATE TABLE IF NOT EXISTS {table_name} (
                    listing_id VARCHAR(255) PRIMARY KEY,
                    name VARCHAR(255),
                    host_id VARCHAR(255),
                    host_since DATE,
                    host_location VARCHAR(255),
                    host_response_time VARCHAR(255),
                    host_response_rate FLOAT,
                    host_acceptance_rate FLOAT,
                    host_is_superhost BOOLEAN,
                    host_total_listings_count FLOAT,
                    host_has_profile_pic BOOLEAN,
                    host_identity_verified BOOLEAN,
                    neighbourhood VARCHAR(255),
                    district VARCHAR(255),
                    latitude FLOAT,
                    longitude FLOAT,
                    property_type VARCHAR(255),
                    room_type VARCHAR(255),
                    accommodates INT,
                    bedrooms FLOAT,
                    amenities TEXT[],
                    price INT,
                    minimum_nights INT,
                    maximum_nights INT,
                    review_scores_rating FLOAT,
                    review_scores_accuracy FLOAT,
                    review_scores_cleanliness FLOAT,
                    review_scores_checkin FLOAT,
                    review_scores_communication FLOAT,
                    review_scores_location FLOAT,
                    review_scores_value FLOAT,
                    instant_bookable BOOLEAN
                )
            """)
            conn.commit()

            # Insert data if table is empty
            # cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            # if cursor.fetchone()[0] == 0:
            insert_data_from_csv(file_path, table_name, conn)
            print(f"Data has been inserted successfully into {table_name}")

        cursor.close()
    except Exception as e:
        print(f"An error occurred while setting up schema and tables: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    # Database connection parameters
    db_params = {
        "host": "localhost",
        "dbname": "airbnb",
        "user": "postgres",
        "password": "toor"
    }

    # File paths and corresponding city names
    files = {
        "Bangkok": "Citywise_Data/Bangkok.csv",
        "Cape_Town": "Citywise_Data/Cape_Town.csv",
        "Hong_Kong": "Citywise_Data/Hong_Kong.csv",
        "Istanbul": "Citywise_Data/Istanbul.csv",
        "Mexico_City": "Citywise_Data/Mexico_City.csv",
        "New_York": "Citywise_Data/New_York.csv",
        "Paris": "Citywise_Data/Paris.csv",
        "Rio_de_Janeiro": "Citywise_Data/Rio_de_Janeiro.csv",
        "Rome": "Citywise_Data/Rome.csv",
        "Sydney": "Citywise_Data/Sydney.csv"
        # "Bangkok": "Temp.csv"
    }

    create_database(db_params["dbname"], db_params["user"], db_params["password"], db_params["host"])
    
    setup_schema_and_tables(db_params, files)


