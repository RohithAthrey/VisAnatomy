import torch
from torch import nn, optim
from torch.utils.data import DataLoader, Dataset
from torchvision import transforms, datasets
import timm
import os
import datetime
import numpy as np
import random
import argparse

def test_accuracy(model, loader, device, topk=5):
    """Calculate both top-1 and top-k accuracy"""
    model.eval()
    correct = 0
    correct_topk = 0
    total = 0
    
    with torch.no_grad():
        for inputs, labels in loader:
            inputs, labels = inputs.to(device), labels.to(device)
            outputs = model(inputs)
            
            # Top-1 accuracy
            _, predicted = torch.max(outputs, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
            
            # Top-k accuracy
            _, indices = torch.topk(outputs, topk, dim=1)
            correct_topk += torch.sum(indices == labels.view(-1, 1)).item()
    
    return correct / total, correct_topk / total

def train_single_seed(seed, data_root='data6'):
    """Train model with a single seed"""
    # Set random seeds for reproducibility
    torch.manual_seed(seed)
    np.random.seed(seed)
    random.seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed(seed)
        torch.cuda.manual_seed_all(seed)
    
    device = torch.device('mps' if torch.backends.mps.is_available() else 'cpu')
    print(f"Using device: {device}")
    print(f"Training with seed: {seed}")

    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])
    ])

    train_dataset = datasets.ImageFolder(root=f'{data_root}/train', transform=transform)
    val_dataset = datasets.ImageFolder(root=f'{data_root}/val', transform=transform)

    train_loader = DataLoader(train_dataset, batch_size=4, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=4, shuffle=False)

    print(f"Number of classes: {len(train_dataset.classes)}")
    print(f"Classes: {train_dataset.classes}")
    print(f"Training samples: {len(train_dataset)}")
    print(f"Validation samples: {len(val_dataset)}")

    model = timm.create_model('vit_base_patch16_224', pretrained=True, num_classes=len(train_dataset.classes))
    model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.0001)

    # Setup output directory and files
    date_time = datetime.datetime.now().strftime("%m-%d-%H-%M-%S")
    output_folder = f'outputs/vit_chart_classifier/seed{seed}_{date_time}'
    os.makedirs(output_folder, exist_ok=True)
    
    # Create output file
    output_file = open(os.path.join(output_folder, 'training_log.txt'), 'w')
    output_file.write(f"Training started at: {datetime.datetime.now()}\n")
    output_file.write(f"Seed: {seed}\n")
    output_file.write(f"Device: {device}\n")
    output_file.write(f"Model: ViT-Base-Patch16-224\n")
    output_file.write(f"Learning rate: 0.0001\n")
    output_file.write(f"Batch size: 4\n")
    output_file.write(f"Classes: {train_dataset.classes}\n")
    output_file.write(f"Training samples: {len(train_dataset)}\n")
    output_file.write(f"Validation samples: {len(val_dataset)}\n\n")

    # Initialize tracking arrays
    num_epochs = 200
    train_acc_list = np.zeros(num_epochs)
    val_acc_list = np.zeros(num_epochs)
    train_acc_top5_list = np.zeros(num_epochs)
    val_acc_top5_list = np.zeros(num_epochs)
    train_loss_list = np.zeros(num_epochs)
    val_loss_list = np.zeros(num_epochs)

    print(f"Starting training for {num_epochs} epochs...")
    print("Epoch | Train Loss | Val Loss | Train Acc | Val Acc | Train Top5 | Val Top5")
    print("-" * 80)

    for epoch in range(num_epochs):
        # Training phase
        model.train()
        running_loss = 0.0
        num_batches = 0
        
        for inputs, labels in train_loader:
            inputs, labels = inputs.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            running_loss += loss.item()
            num_batches += 1

        avg_train_loss = running_loss / num_batches

        # Validation phase
        model.eval()
        val_loss = 0.0
        val_batches = 0
        
        with torch.no_grad():
            for inputs, labels in val_loader:
                inputs, labels = inputs.to(device), labels.to(device)
                outputs = model(inputs)
                loss = criterion(outputs, labels)
                val_loss += loss.item()
                val_batches += 1

        avg_val_loss = val_loss / val_batches

        # Calculate accuracies
        train_acc, train_acc_top5 = test_accuracy(model, train_loader, device)
        val_acc, val_acc_top5 = test_accuracy(model, val_loader, device)

        # Store metrics
        train_loss_list[epoch] = avg_train_loss
        val_loss_list[epoch] = avg_val_loss
        train_acc_list[epoch] = train_acc
        val_acc_list[epoch] = val_acc
        train_acc_top5_list[epoch] = train_acc_top5
        val_acc_top5_list[epoch] = val_acc_top5

        # Print progress
        print(f"{epoch+1:5d} | {avg_train_loss:10.4f} | {avg_val_loss:8.4f} | {train_acc:9.4f} | {val_acc:7.4f} | {train_acc_top5:10.4f} | {val_acc_top5:8.4f}")

        # Write to log file
        log_line = f"Epoch: {epoch+1:03d}, Train Loss: {avg_train_loss:.4f}, Val Loss: {avg_val_loss:.4f}, Train Acc: {train_acc:.4f}, Val Acc: {val_acc:.4f}, Train Top5: {train_acc_top5:.4f}, Val Top5: {val_acc_top5:.4f}\n"
        output_file.write(log_line)
        output_file.flush()  # Ensure immediate writing

        # Save checkpoint every 50 epochs
        if (epoch + 1) % 50 == 0:
            checkpoint_path = os.path.join(output_folder, f'checkpoint_epoch_{epoch+1}.pth')
            torch.save({
                'epoch': epoch + 1,
                'model_state_dict': model.state_dict(),
                'optimizer_state_dict': optimizer.state_dict(),
                'train_acc': train_acc,
                'val_acc': val_acc,
                'train_loss': avg_train_loss,
                'val_loss': avg_val_loss
            }, checkpoint_path)
            print(f"Checkpoint saved: {checkpoint_path}")

    # Save final model
    final_model_path = os.path.join(output_folder, 'chart_classifier_final.pth')
    torch.save(model.state_dict(), final_model_path)
    
    # Save training history
    history_path = os.path.join(output_folder, 'training_history.npz')
    np.savez(history_path, 
             train_acc_list=train_acc_list, 
             val_acc_list=val_acc_list,
             train_acc_top5_list=train_acc_top5_list, 
             val_acc_top5_list=val_acc_top5_list,
             train_loss_list=train_loss_list,
             val_loss_list=val_loss_list)

    # Summary
    best_val_acc = np.max(val_acc_list)
    best_val_epoch = np.argmax(val_acc_list) + 1
    final_train_acc = train_acc_list[-1]
    final_val_acc = val_acc_list[-1]

    summary_text = f"""
Training completed for seed {seed}!
===================
Best validation accuracy: {best_val_acc:.4f} at epoch {best_val_epoch}
Final training accuracy: {final_train_acc:.4f}
Final validation accuracy: {final_val_acc:.4f}
Final training top-5 accuracy: {train_acc_top5_list[-1]:.4f}
Final validation top-5 accuracy: {val_acc_top5_list[-1]:.4f}

Files saved:
- Model: {final_model_path}
- Training history: {history_path}
- Training log: {os.path.join(output_folder, 'training_log.txt')}
"""

    print(summary_text)
    output_file.write(summary_text)
    output_file.close()

    print(f"Results for seed {seed} saved to: {output_folder}")
    print("=" * 80)
    
    return best_val_acc, final_val_acc, output_folder

def main(seed=None):
    """Main function to run training with a single seed"""
    # Default seed if none provided
    if seed is None:
        seed = 12345

    print("ViT Chart Classification Training")
    print("=" * 50)
    print(f"Training with seed: {seed}")
    print("=" * 50)
    
    try:
        best_val_acc, final_val_acc, output_folder = train_single_seed(seed)
        
        # Summary
        print("\n" + "=" * 80)
        print("🎯 TRAINING SUMMARY")
        print("=" * 80)
        print(f"Seed: {seed}")
        print(f"Best validation accuracy: {best_val_acc:.4f}")
        print(f"Final validation accuracy: {final_val_acc:.4f}")
        print(f"Output folder: {output_folder}")
        print("Status: ✅ Success")
        
    except Exception as e:
        print(f"❌ Error training with seed {seed}: {e}")
        print("Status: ❌ Failed")
        return None
    
    print("\n🎉 Training completed!")
    print(f"Results saved in: {output_folder}")
    
    return best_val_acc, final_val_acc, output_folder

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Train ViT model for chart classification')
    parser.add_argument('--seed', type=int, default=12345,
                        help='Seed to use for training (default: 12345)')
    
    args = parser.parse_args()
    
    main(args.seed)