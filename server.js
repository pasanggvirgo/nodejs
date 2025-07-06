import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); // Serve static files

// MongoDB Connection
mongoose.connect('mongodb+srv://sherpapasang877:4KblJTAnZDFHpEGl@cluster0.qwnvwgu.mongodb.net/ecomercedb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// ---------------- USER SCHEMA ----------------
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userMode: { type: String, required: true }, // 'admin' or 'user'
});
const User = mongoose.model('User', userSchema);

// Signup Route
app.post('/signup', async (req, res) => {
  const { username, password, userMode } = req.body;

  try {
    const existingUser = await User.findOne({ username, userMode });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, userMode });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { username, password, userMode } = req.body;

  try {
    const user = await User.findOne({ username, userMode });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  await Product.deleteOne({ _id: id });
  res.json({ message: 'Product deleted' });
});

app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const result = await Product.findByIdAndUpdate(id, updatedData, { new: true });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
});
// Get single product by ID
app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});




// ---------------- PRODUCT SCHEMA ----------------
const productSchema = new mongoose.Schema({
   name: String,
  price: Number,
  description: String,
  images: [String],
  sizes: [String],
  colors: [String],
  category: String,
});
const Product = mongoose.model('Product', productSchema);

app.post('/add-product', upload.array('images', 5), async (req, res) => {
  try {
    const { name, price, sizes, colors, description, category } = req.body;
    const sizesArray = sizes ? sizes.split(',') : [];
    const colorsArray = colors ? colors.split(',') : [];
    const imagePaths = req.files.map(file => `http://localhost:${PORT}/uploads/${file.filename}`);

    const newProduct = new Product({
      name,
      price,
      description,
      category,
      sizes: sizesArray,
      colors: colorsArray,
      images: imagePaths,
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// Get All Products
app.get('/products', async (req, res) => {
  try {
    const allProducts = await Product.find();
    res.json(allProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// =================== START SERVER ===================
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});