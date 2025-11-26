"""
YOLOv8m Training Script for Bone Fracture Detection
Trains on the Human Bone Fractures Multi-modal Image Dataset
"""

from ultralytics import YOLO
import torch
import os

def train_yolo_model():
    """Train YOLOv8m model on bone fracture dataset"""
    
    # Check CUDA availability
    print("=" * 70)
    print("System Information")
    print("=" * 70)
    print(f"PyTorch version: {torch.__version__}")
    print(f"CUDA available: {torch.cuda.is_available()}")
    if torch.cuda.is_available():
        print(f"CUDA version: {torch.version.cuda}")
        print(f"GPU Device: {torch.cuda.get_device_name(0)}")
        print(f"GPU Memory: {torch.cuda.get_device_properties(0).total_memory / 1024**3:.2f} GB")
    print("=" * 70)
    print()
    
    # Dataset path
    dataset_path = r"C:\Users\sanjay\Documents\Meditrack\Human Bone Fractures Multi-modal Image Dataset (HBFMID)\Human Bone Fractures Multi-modal Image Dataset (HBFMID)\Bone Fractures Detection\data.yaml"
    
    # Verify dataset exists
    if not os.path.exists(dataset_path):
        print(f"❌ Error: Dataset not found at {dataset_path}")
        return
    
    print(f"✅ Dataset found: {dataset_path}")
    print()
    
    # Load YOLOv8m model
    print("📦 Loading YOLOv8m model...")
    model = YOLO('yolov8m.pt')  # Load pretrained YOLOv8m
    print("✅ Model loaded successfully")
    print()
    
    # Training configuration
    print("=" * 70)
    print("Training Configuration")
    print("=" * 70)
    print("Model: YOLOv8m")
    print("Dataset: Bone Fractures Detection")
    print("Classes: 10 (Comminuted, Greenstick, Healthy, Linear, etc.)")
    print("Epochs: 100")
    print("Image Size: 640x640")
    print("Batch Size: 16")
    print("Device: GPU (CUDA)")
    print("=" * 70)
    print()
    
    # Train the model
    print("🚀 Starting training...")
    print()
    
    try:
        results = model.train(
            data=dataset_path,
            epochs=100,
            imgsz=640,
            batch=16,
            name='bone_fracture_yolov8m',
            device=0,  # Use GPU 0
            patience=20,  # Early stopping patience
            save=True,
            save_period=10,  # Save checkpoint every 10 epochs
            cache=False,  # Don't cache images (saves RAM)
            workers=8,  # Number of dataloader workers
            project='runs/detect',  # Save location
            exist_ok=True,
            pretrained=True,
            optimizer='AdamW',
            verbose=True,
            seed=42,
            deterministic=False,
            single_cls=False,
            rect=False,
            cos_lr=True,  # Cosine learning rate scheduler
            close_mosaic=10,  # Disable mosaic augmentation for last N epochs
            amp=True,  # Automatic Mixed Precision
            fraction=1.0,  # Train on 100% of data
            profile=False,
            freeze=None,
            lr0=0.01,  # Initial learning rate
            lrf=0.01,  # Final learning rate (lr0 * lrf)
            momentum=0.937,
            weight_decay=0.0005,
            warmup_epochs=3.0,
            warmup_momentum=0.8,
            warmup_bias_lr=0.1,
            box=7.5,  # Box loss gain
            cls=0.5,  # Class loss gain
            dfl=1.5,  # DFL loss gain
            pose=12.0,
            kobj=1.0,
            label_smoothing=0.0,
            nbs=64,
            hsv_h=0.015,  # HSV-Hue augmentation
            hsv_s=0.7,  # HSV-Saturation augmentation
            hsv_v=0.4,  # HSV-Value augmentation
            degrees=0.0,  # Rotation augmentation
            translate=0.1,  # Translation augmentation
            scale=0.5,  # Scale augmentation
            shear=0.0,  # Shear augmentation
            perspective=0.0,  # Perspective augmentation
            flipud=0.0,  # Vertical flip augmentation
            fliplr=0.5,  # Horizontal flip augmentation
            mosaic=1.0,  # Mosaic augmentation
            mixup=0.0,  # Mixup augmentation
            copy_paste=0.0  # Copy-paste augmentation
        )
        
        print()
        print("=" * 70)
        print("✅ Training completed successfully!")
        print("=" * 70)
        print()
        print("Training Results:")
        print(f"  - Best weights: runs/detect/bone_fracture_yolov8m/weights/best.pt")
        print(f"  - Last weights: runs/detect/bone_fracture_yolov8m/weights/last.pt")
        print(f"  - Results: runs/detect/bone_fracture_yolov8m/")
        print()
        
        # Validation results
        print("Validation Metrics:")
        if hasattr(results, 'results_dict'):
            metrics = results.results_dict
            print(f"  - mAP50: {metrics.get('metrics/mAP50(B)', 'N/A')}")
            print(f"  - mAP50-95: {metrics.get('metrics/mAP50-95(B)', 'N/A')}")
            print(f"  - Precision: {metrics.get('metrics/precision(B)', 'N/A')}")
            print(f"  - Recall: {metrics.get('metrics/recall(B)', 'N/A')}")
        print()
        
        # Export to ONNX for deployment (optional)
        print("📦 Exporting model to ONNX format...")
        try:
            model.export(format='onnx', dynamic=True, simplify=True)
            print("✅ Model exported successfully")
        except Exception as e:
            print(f"⚠️ Export failed: {e}")
        
        print()
        print("=" * 70)
        print("Next Steps:")
        print("1. Check training results in: runs/detect/bone_fracture_yolov8m/")
        print("2. View training curves and metrics")
        print("3. Test the model on validation images")
        print("4. Integrate the best.pt model into your prediction API")
        print("=" * 70)
        
    except Exception as e:
        print()
        print("=" * 70)
        print(f"❌ Training failed with error:")
        print(f"{type(e).__name__}: {e}")
        print("=" * 70)
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    train_yolo_model()
