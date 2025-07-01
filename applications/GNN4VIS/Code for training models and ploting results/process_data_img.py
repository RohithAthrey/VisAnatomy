import glob
import json
import re
import os
import torch
from torch_geometric.data import Data
import torchvision.transforms as transforms
from PIL import Image
import gc  # for garbage collection


# Define transforms for preprocessing the images for ViT
transform = transforms.Compose([
    transforms.Resize((224, 224)),  # Resize images to match ViT input size
    transforms.ToTensor(),           # Convert images to PyTorch tensors
    transforms.Normalize(            # Normalize the images (ImageNet standard - works well for ViT)
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

# No need for ResNet when using ViT - ViT works directly on raw images

# get the current directory
current_dir = os.path.dirname(os.path.realpath(__file__))

# Updated paths to use graphData_v4_updated and charts_png
data_dir = current_dir + "/data/GNN Dataset/graphData_v4_filtered_06292025"
json_files = sorted(glob.glob(f'{data_dir}/*.json'))
img_dir = current_dir + "/../../../charts_png"

# Process in batches to avoid memory issues
batch_size = 16  # Adjust this based on your available memory
data_list = []

print(f"Processing {len(json_files)} files in batches of {batch_size}")

for i in range(0, len(json_files), batch_size):
    batch_files = json_files[i:i+batch_size]
    print(f'Processing batch {i//batch_size + 1}/{(len(json_files)-1)//batch_size + 1}')
    
    batch_data = []
    
    for json_file in batch_files:
        with open(json_file) as file:
            raw_data = json.load(file)
            
        fname = os.path.basename(json_file).split('.')[0]
        img_path = os.path.join(img_dir, f'{fname}.png')
        
        # Load and preprocess image for ViT
        img = transform(Image.open(img_path).convert("RGB"))
        # Note: No need to add batch dimension here - DataLoader will handle batching

        # create Data object
        data = Data()
        data.y = torch.tensor([raw_data["label"]])
        data.train = torch.tensor(raw_data["splition"]=="training", dtype=torch.bool)
        data.img = img  # Store the preprocessed image tensor

        batch_data.append(data)
        
        # Clear variables to free memory
        del img
    
    # Add batch to main list
    data_list.extend(batch_data)
    
    # Force garbage collection
    gc.collect()
    
    print(f'Batch {i//batch_size + 1} completed. Total processed: {len(data_list)}')

print("All batches processed. Saving data...")

# save processed data
torch.save(data_list, f'{data_dir}_vit.pt')

print(f"Data saved to {data_dir}_vit.pt")