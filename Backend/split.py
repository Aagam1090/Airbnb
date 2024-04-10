import pandas as pd
import os

def is_ascii(s):
    try:
        s.encode(encoding='ascii')
    except UnicodeEncodeError:
        return False
    else:
        return True

try:
    save_path = 'Citywise_Data'

    # Create the directory if it does not exist
    if not os.path.exists(save_path):
        os.makedirs(save_path)

    df = pd.read_csv("../Airbnb Data/Listings.csv", encoding="ISO-8859-1", low_memory=False)
        
    is_ascii_vectorized = lambda col: col.apply(lambda x: is_ascii(str(x)))
    df = df[df.apply(is_ascii_vectorized, axis=0).all(axis=1)]
    
    grouped = df.groupby('city')
    
    for city, data in grouped:
        filename = os.path.join(save_path, f"{city.replace(' ', '_').replace('/', '_')}.csv")
        data.to_csv(filename, index=False)
        print(f"Saved {filename}")

except UnicodeDecodeError as e:
    print(f"Error reading file with ISO-8859-1 encoding: {e}")
