import glob
import json
import re
import os
import torch
from torch_geometric.data import Data
from torch_geometric.utils import to_undirected

# get the current directory
current_dir = os.path.dirname(os.path.realpath(__file__))

data_dir = current_dir + "/data/GNN Dataset/graphData_v4"
json_files = sorted(glob.glob(f'{data_dir}/*.json'))
print("Number of json files: ", len(json_files))

data_list = []
for json_file in json_files:
    with open(json_file) as file:
        raw_data = json.load(file)
        
    print(f'Processing {json_file}')

    # create Data object
    data = Data()
    for i in range(len(raw_data["nodes"])):
        if "v1" in data_dir and len(raw_data["nodes"][i]) == 11:
            # handling <g> nodes
            # print(f"{i}: {len(raw_data['nodes'][i])}")
            raw_data["nodes"][i] +=  [0] * 7
    data.x = torch.tensor(raw_data["nodes"], dtype=torch.float)
    data.edge_index = to_undirected(torch.tensor(raw_data["edges"],  dtype=torch.long).t().contiguous())

    data.y = torch.tensor([raw_data["label"]])
    data.train = torch.tensor(raw_data["splition"]=="training", dtype=torch.bool)

    data_list.append(data)

# save processed data
torch.save(data_list, f'{data_dir}.pt')