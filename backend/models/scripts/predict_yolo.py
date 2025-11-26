"""
YOLOv8 Bone Fracture Detection API
Provides JSON-based interface for YOLOv8 fracture detection and classification
"""

import json
import sys
import os
from ultralytics import YOLO
from PIL import Image
import torch

def predict_fracture_yolo(image_path, model_path="./runs/detect/bone_fracture_yolov8m/weights/best.pt"):
    """
    Predict bone fractures using YOLOv8 model
    
    Args:
        image_path: Path to the X-ray image
        model_path: Path to the trained YOLOv8 model
        
    Returns:
        dict: Prediction results with detections and classifications
    """
    try:
        # Check if model exists
        if not os.path.exists(model_path):
            return {
                'error': f'Model file not found at {model_path}',
                'prediction': None,
                'confidence': 0,
                'detections': []
            }
        
        # Load YOLOv8 model
        model = YOLO(model_path)
        
        # Check if CUDA is available
        device = 'cuda' if torch.cuda.is_available() else 'cpu'
        model.to(device)
        
        # Run inference
        results = model.predict(
            source=image_path,
            conf=0.25,  # Confidence threshold
            iou=0.45,   # NMS IoU threshold
            device=device,
            verbose=False
        )
        
        # Process results
        result = results[0]
        boxes = result.boxes
        
        # Class names from the model
        class_names = result.names  # Dictionary of class IDs to names
        
        detections = []
        max_confidence = 0.0
        primary_class = "Healthy"
        
        # Process each detection
        for box in boxes:
            cls_id = int(box.cls[0])
            confidence = float(box.conf[0])
            bbox = box.xyxy[0].tolist()  # [x1, y1, x2, y2]
            
            class_name = class_names[cls_id]
            
            detections.append({
                'class': class_name,
                'confidence': confidence * 100,
                'bbox': {
                    'x1': bbox[0],
                    'y1': bbox[1],
                    'x2': bbox[2],
                    'y2': bbox[3]
                }
            })
            
            # Track highest confidence detection
            if confidence > max_confidence:
                max_confidence = confidence
                primary_class = class_name
        
        # Determine if fractured
        is_fractured = len(detections) > 0 and primary_class != "Healthy"
        
        # Calculate class probabilities
        class_counts = {}
        for detection in detections:
            cls = detection['class']
            class_counts[cls] = class_counts.get(cls, 0) + 1
        
        result_data = {
            'prediction': 'fractured' if is_fractured else 'not fractured',
            'confidence': float(max_confidence * 100) if detections else 0.0,
            'primary_class': primary_class,
            'num_detections': len(detections),
            'detections': detections,
            'class_summary': class_counts,
            'image_shape': {
                'width': int(result.orig_shape[1]),
                'height': int(result.orig_shape[0])
            }
        }
        
        return result_data
        
    except Exception as e:
        return {
            'error': str(e),
            'prediction': None,
            'confidence': 0,
            'detections': []
        }

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='YOLOv8 Bone Fracture Detection (JSON output)')
    parser.add_argument('image_path', type='str', help='Path to the X-ray image')
    parser.add_argument('--model', type=str, default='./runs/detect/bone_fracture_yolov8m/weights/best.pt',
                        help='Path to the trained YOLOv8 model')
    
    args = parser.parse_args()
    
    result = predict_fracture_yolo(args.image_path, args.model)
    print(json.dumps(result))
