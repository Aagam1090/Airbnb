import os
import pandas as pd

def is_ascii(s):
    try:
        s.encode(encoding='ascii')
    except UnicodeEncodeError:
        return False
    else:
        return True
    
def is_numeric(id):
    """Check if the id is a numeric value."""
    try:
        float(id)  # Try converting to float
        return True
    except ValueError:
        return False
    
def process_and_save_files(source_directory, destination_directory):
    # Ensure destination directory exists
    if not os.path.exists(destination_directory):
        os.makedirs(destination_directory)
    
    # Loop through all the directories in the source directory
    for city in os.listdir(source_directory):
        city_path = os.path.join(source_directory, city)
        if os.path.isdir(city_path):
            # Define source file paths
            listings_source_path = os.path.join(city_path, 'listings.csv')
            reviews_source_path = os.path.join(city_path, 'reviews.csv')
            
            # Define destination directory and file paths
            city_dest_path = os.path.join(destination_directory, city)
            if not os.path.exists(city_dest_path):
                os.makedirs(city_dest_path)
            listings_dest_path = os.path.join(city_dest_path, 'listings.csv')
            reviews_dest_path = os.path.join(city_dest_path, 'reviews.csv')
            
            # Process listings.csv if it exists
            if os.path.exists(listings_source_path):
                df_listings = pd.read_csv(listings_source_path)
                # Filter and process the data
                df_listings = df_listings[['id', 'name', 'host_location', 'property_type', 'accommodates', 'bathrooms_text', 'beds', 'amenities', 'price', 'review_scores_rating']]

                # Remove $ sign from price and convert to float
                df_listings['price'] = df_listings['price'].replace('[\$,]', '', regex=True).astype(float)
                df_listings = df_listings[df_listings['id'].apply(is_numeric)]  # Ensure id is numeric

                is_ascii_vectorized = lambda col: col.apply(lambda x: is_ascii(str(x)))
                df_listings = df_listings[df_listings.apply(is_ascii_vectorized, axis=0).all(axis=1)]

                # Save to new CSV
                df_listings.to_csv(listings_dest_path, index=False)
                print(f"Processed listings for {city} saved to {listings_dest_path}")
            
            # Process reviews.csv if it exists
            if os.path.exists(reviews_source_path):
                df_reviews = pd.read_csv(reviews_source_path)
                # Filter and process the data
                df_reviews = df_reviews[['id', 'listing_id', 'reviewer_id','reviewer_name', 'comments']]
                df_reviews = df_reviews[df_reviews['listing_id'].apply(is_numeric)]  # Ensure listing_id is numeric
                df_reviews = df_reviews[df_reviews['id'].apply(is_numeric)]  # Ensure listing_id is numeric

                is_ascii_vectorized = lambda col: col.apply(lambda x: is_ascii(str(x)))
                df_reviews = df_reviews[df_reviews.apply(is_ascii_vectorized, axis=0).all(axis=1)]

                # Save to new CSV
                df_reviews.to_csv(reviews_dest_path, index=False)
                print(f"Processed reviews for {city} saved to {reviews_dest_path}")

if __name__ == "__main__":
    source_dir = '../Airbnb Data'
    dest_dir = './Citywise_Data'
    process_and_save_files(source_dir, dest_dir)
