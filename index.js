import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",   
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});


mongoose.connect("mongodb+srv://dyapasanjay1:GHlkuFdhLKUwk7ci@sanjay.ujsmsll.mongodb.net/meditrack");


const userSchema = new mongoose.Schema({
  aadhaar: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

app.post("/signup", async (req, res) => {
  const { aadhaar, password } = req.body;

  try {
    const existingUser = await User.findOne({ aadhaar });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ aadhaar, password });
    await newUser.save();

    res.json({ message: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);  
    res.status(500).json({ message: "Error signing up" });
  }
});



app.post("/login", async (req, res) => {
  const { aadhaar, password } = req.body;

  try {
    const user = await User.findOne({ aadhaar });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Prediction endpoint
app.post("/predict", upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const imagePath = req.file.path;
    const modelPath = path.join(__dirname, 'backend', 'models', 'scripts', 'pretrained_models', 'bone_fracture_model.pth');
    const predictScript = path.join(__dirname, 'backend', 'models', 'scripts', 'predict_api.py');

    // Check if model exists - if not, return demo prediction
    if (!fs.existsSync(modelPath)) {
      // Clean up uploaded file
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting temp file:', err);
      });
      
      // Return a demo prediction for testing
      console.log('Model not found, returning demo prediction');
      return res.json({
        prediction: "not fractured",
        confidence: 87.5,
        probabilities: {
          'fractured': 12.5,
          'not fractured': 87.5
        },
        note: "This is a demo prediction. Please train the model for real predictions."
      });
    }

    // Run Python prediction script with JSON output
    const pythonProcess = spawn('python', [predictScript, imagePath, '--model', modelPath]);
    
    let result = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
      // Clean up uploaded file
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting temp file:', err);
      });

      if (code !== 0) {
        console.error('Python script error:', errorOutput);
        return res.status(500).json({ 
          message: "Prediction failed. Please ensure Python and required packages are installed.", 
          error: errorOutput 
        });
      }

      try {
        // Parse JSON output from Python script
        const prediction = JSON.parse(result);
        
        if (prediction.error) {
          return res.status(500).json({
            message: "Error during prediction",
            error: prediction.error
          });
        }
        
        res.json(prediction);
        
      } catch (parseError) {
        console.error('Error parsing result:', parseError);
        console.error('Raw output:', result);
        res.status(500).json({ 
          message: "Error processing prediction result",
          error: parseError.message,
          rawOutput: result
        });
      }
    });

  } catch (error) {
    console.error("Prediction error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Hello from server");
});



app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
