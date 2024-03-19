import csv
import json
import os

def extract_province_city_info(csv_file):
    provinces = set()
    province_city_map = {}

    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            prov_en = row['Prov_EN']
            city_en = row['City_EN']
            provinces.add(prov_en)
            if prov_en in province_city_map:
                province_city_map[prov_en].add(city_en)
            else:
                province_city_map[prov_en] = {city_en}

    return list(provinces), {prov: list(cities) for prov, cities in province_city_map.items()}


script_dir = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
file_path = os.path.join(script_dir, "targeted SVGs with Annotations", "GeoHeatmap9_data.csv")
unique_provinces, province_city_dict = extract_province_city_info(file_path)
# Print the unique provinces
print("Unique Provinces:", unique_provinces)

# Print the province-city mapping as JSON
print("Province-City Mapping:")
print(json.dumps(province_city_dict, indent=4))