import os
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import models, transforms, datasets
from torch.utils.data import DataLoader, Subset
import random
from PIL import ImageFile
ImageFile.LOAD_TRUNCATED_IMAGES = True


def train_model(data_dir, model_save_path="./pretrained_models/bone_fracture_model.pth", 
                epochs=5, batch_size=32, simulate=False):
    """
    If simulate=True, then training will use a lighter model (ResNet-18), only run 1 epoch,
    and use a small subset of the data.
    """
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    # Define transforms
    train_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(10),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    val_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    test_transform = val_transform

    train_folder = os.path.join(data_dir, 'train')
    if os.path.isdir(train_folder):
        print("Using pre-split dataset directories.")
        train_dataset = datasets.ImageFolder(root=train_folder, transform=train_transform)
        val_dataset = datasets.ImageFolder(root=os.path.join(data_dir, 'val'), transform=val_transform)
        test_dataset = datasets.ImageFolder(root=os.path.join(data_dir, 'test'), transform=test_transform)
    else:
        print("No pre-split directories found. Performing automatic split on the full dataset.")
        full_dataset = datasets.ImageFolder(root=data_dir, transform=train_transform)
        num_samples = len(full_dataset)
        indices = list(range(num_samples))
        random.shuffle(indices)
        train_size = int(0.7 * num_samples)
        val_size = int(0.15 * num_samples)
        test_size = num_samples - train_size - val_size
        train_dataset = Subset(full_dataset, indices[:train_size])
        val_dataset = Subset(full_dataset, indices[train_size:train_size + val_size])
        test_dataset = Subset(full_dataset, indices[train_size + val_size:])

    if simulate:
        print("Simulation mode enabled: reducing dataset size and epochs for faster testing.")
        train_dataset = Subset(train_dataset, list(range(min(10, len(train_dataset)))))
        val_dataset = Subset(val_dataset, list(range(min(5, len(val_dataset)))))
        test_dataset = Subset(test_dataset, list(range(min(5, len(test_dataset)))))
        epochs = 1

    class_names = datasets.ImageFolder(root=train_folder if os.path.isdir(train_folder) else data_dir).classes
    print(f"Class names: {class_names}")
    print(f"Training samples: {len(train_dataset)}")
    print(f"Validation samples: {len(val_dataset)}")
    print(f"Test samples: {len(test_dataset)}")

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)
    
    model = models.resnet50(pretrained=True) if not simulate else models.resnet18(pretrained=True)
    print("Using ResNet-50 for full training." if not simulate else "Using ResNet-18 for simulation.")
    model.fc = nn.Linear(model.fc.in_features, 2)
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.0001)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, 'min', patience=2, factor=0.5)

    print("Starting Training...")
    best_val_loss = float('inf')
    for epoch in range(epochs):
        model.train()
        running_loss, correct, total = 0.0, 0, 0
        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            running_loss += loss.item()
            _, predicted = torch.max(outputs, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
        train_loss, train_acc = running_loss / len(train_loader), 100 * correct / total

        model.eval()
        val_loss, val_correct, val_total = 0.0, 0, 0
        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                loss = criterion(outputs, labels)
                val_loss += loss.item()
                _, predicted = torch.max(outputs, 1)
                val_total += labels.size(0)
                val_correct += (predicted == labels).sum().item()
        val_loss /= len(val_loader)
        val_acc = 100 * val_correct / val_total

        scheduler.step(val_loss)
        print(f"Epoch {epoch+1}/{epochs}: Train Loss={train_loss:.4f}, Train Acc={train_acc:.2f}%, "
              f"Val Loss={val_loss:.4f}, Val Acc={val_acc:.2f}%")
        
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            os.makedirs(os.path.dirname(model_save_path), exist_ok=True)
            torch.save(model.state_dict(), model_save_path)
            print(f"Model saved at epoch {epoch+1} with val loss {val_loss:.4f}")

    print("Model Training Completed!")

    test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)
    model.load_state_dict(torch.load(model_save_path))
    model.eval()
    test_correct, test_total = 0, 0
    with torch.no_grad():
        for images, labels in test_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            _, predicted = torch.max(outputs, 1)
            test_total += labels.size(0)
            test_correct += (predicted == labels).sum().item()
    test_acc = 100 * test_correct / test_total
    print(f"Test Accuracy: {test_acc:.2f}%")

    return model, test_acc