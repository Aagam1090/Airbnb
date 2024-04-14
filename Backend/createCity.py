import datetime
import psycopg2
import os

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

def setup_schema_and_tables(db_params, directory_path):
    try:
        conn = psycopg2.connect(**db_params)
        cursor = conn.cursor()
        # Create schema
        cursor.execute("CREATE SCHEMA IF NOT EXISTS Cities")

        # Create table if not exists within the Cities schema
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS Cities.city_info (
                city_name VARCHAR(255) PRIMARY KEY
            )
        """)

        # Loop through files in the directory
        for folder_name in os.listdir(directory_path):
            folder_path = os.path.join(directory_path, folder_name)
            if os.path.isdir(folder_path):
                city_name = folder_name  # The folder name is the city name
                
                # Insert data into the database
                cursor.execute('INSERT INTO Cities.city_info (city_name) VALUES (%s) ON CONFLICT (city_name) DO NOTHING', (city_name,))

        # Commit changes and close the connection
        conn.commit()
        cursor.close()
        conn.close()
        print("Data successfully inserted and schema set up.")

    except Exception as e:
        print(f"Failed to insert data into the city database: {e}")

if __name__ == "__main__":
    # Database connection parameters
    db_params = {
        "host": "localhost",
        "dbname": "airbnb",
        "user": "postgres",
        "password": "toor"
    }

    directory_path = '../Airbnb Data/'

    create_database(db_params["dbname"], db_params["user"], db_params["password"], db_params["host"])
    
    setup_schema_and_tables(db_params, directory_path)


