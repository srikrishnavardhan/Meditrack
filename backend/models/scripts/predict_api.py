"""
Simple API wrapper for bone fracture prediction
This script provides a JSON-based interface for the prediction model
"""

import torch
from torchvision import transforms, models
from PIL import Image
import json
import sys
import os
import torch.nn as nn
import torch.nn.functional as F

def predict_fracture_json(image_path, model_path="./pretrained_models/bone_fracture_model.pth"):
    try:
        # Load the trained model
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # Define the model architecture
        model = models.resnet50(pretrained=False)
        num_ftrs = model.fc.in_features
        model.fc = nn.Linear(num_ftrs, 2)

        # Load model weights
        checkpoint = torch.load(model_path, map_location=device)
        if isinstance(checkpoint, dict) and 'model_state_dict' in checkpoint:
            model.load_state_dict(checkpoint['model_state_dict'])
        else:
            model.load_state_dict(checkpoint)

        model = model.to(device)
        model.eval()

        # Image preprocessing
        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        
        # Load and preprocess the image
        image = Image.open(image_path).convert('RGB')
        image_tensor = transform(image).unsqueeze(0).to(device)
        
        # Get prediction
        with torch.no_grad():
            outputs = model(image_tensor)
            probabilities = F.softmax(outputs, dim=1).cpu().numpy()[0]
            predicted_class = torch.argmax(outputs, dim=1).item()
        
        class_names = ['fractured', 'not fractured']
        result = {
            'prediction': class_names[predicted_class],
            'confidence': float(probabilities[predicted_class] * 100),
            'probabilities': {
                class_names[i]: float(probabilities[i] * 100) 
                for i in range(len(class_names))
            }
        }
        
        return result
        
    except Exception as e:
        return {
            'error': str(e),
            'prediction': None,
            'confidence': 0,
            'probabilities': {}
        }

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Predict bone fracture from X-ray image (JSON output)')
    parser.add_argument('image_path', type=str, help='Path to the X-ray image')
    parser.add_argument('--model', type=str, default='./pretrained_models/bone_fracture_model.pth', 
                        help='Path to the trained model')
    
    args = parser.parse_args()
    
    result = predict_fracture_json(args.image_path, args.model)
    print(json.dumps(result))
