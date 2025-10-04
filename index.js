const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const mongoose = require('mongoose');

app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
})

// mongoose.connect('mongodb+srv://webdev_user:7qIViCrYDX9Jpqty@cluster0.7dodtzu.mongodb.net/myfirstdatabase/?retryWrites=true&w=majority&appName=Cluster0');
mongoose.connect(process.env.MONGODB_URI);

// Creating a User Model
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number
});
const User = mongoose.model('User', UserSchema)

// Basic route
app.get('/', (req, res) => {
    res.send('Server is working with MongoDB!');
})

// GET all users from database
app.get('/api/users',  async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST create a new user in database
app.post('/api/users', async (req, res) => {
    try {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            age: req.body.age
        });
        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE a user in database
app.delete('/api/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})