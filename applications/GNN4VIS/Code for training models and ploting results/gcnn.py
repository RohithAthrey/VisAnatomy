import torch
import torch.nn as nn
import torch.nn.functional as F
from torch_geometric.nn import GCNConv
from torch_geometric.nn import global_mean_pool


class GCNN(torch.nn.Module):
    def __init__(self, hidden_channels, num_node_features, num_classes):
        super(GCNN, self).__init__()
        # Graph convolutional layers
        self.conv1 = GCNConv(num_node_features, hidden_channels)
        self.conv2 = GCNConv(hidden_channels, hidden_channels)
        self.conv3 = GCNConv(hidden_channels, hidden_channels)

        # Image convolutional layers
        self.img_conv1 = nn.Conv2d(in_channels=3, out_channels=16, kernel_size=3, stride=1, padding=1)
        self.img_conv2 = nn.Conv2d(in_channels=16, out_channels=32, kernel_size=3, stride=1, padding=1)
        self.img_conv3 = nn.Conv2d(in_channels=32, out_channels=64, kernel_size=3, stride=1, padding=1)
        
        # Max-pooling layers
        self.pool = nn.MaxPool2d(kernel_size=2, stride=2, padding=0)
        
        # Fully connected layers
        self.fc1 = nn.Linear(64 * 28 * 28, 512)  # Assuming input image size is 224x224
        self.fc2 = nn.Linear(512, hidden_channels)
        self.relu = nn.ReLU()

        self.lin = nn.Linear(hidden_channels*2, num_classes)


    def forward(self, x, edge_index, batch, imgs):
        # 1. Obtain node embeddings 
        x = self.conv1(x, edge_index)
        x = x.relu()
        x = self.conv2(x, edge_index)
        x = x.relu()
        x = self.conv3(x, edge_index)

        # 2. Readout layer
        x = global_mean_pool(x, batch)  # [batch_size, hidden_channels]

        # 3. Extract image features
        x2 = self.pool(self.relu(self.img_conv1(imgs)))
        x2 = self.pool(self.relu(self.img_conv2(x2)))
        x2 = self.pool(self.relu(self.img_conv3(x2)))
        x2 = x2.view(-1, 64 * 28 * 28)  # Assuming input image size is 224x224
        x2 = self.relu(self.fc1(x2))
        x2 = self.fc2(x2)

        # 4. Concatenate graph features with image features
        x = torch.cat((x, x2), dim=1)

        # 5. Apply a final classifier
        x = F.dropout(x, p=0.5, training=self.training)
        x = self.lin(x)
        
        return x
