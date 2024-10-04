const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());  // Middleware to parse JSON bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

  // Define a schema for the items
const itemSchema = new mongoose.Schema({
  message: { type: String, required: true },
  author: { type: String, required: true },
});

// Create a model from the schema
const Item = mongoose.model('Item', itemSchema);

// GET route for the root path
app.get('/', async (req, res) => {
  try {
      const items = await Item.find(); // Fetch all items from the database
      res.json(items); // Respond with the items
  } catch (error) {
      console.error('Error fetching items from MongoDB:', error);
      res.status(500).json({ status: 'error', message: 'Failed to fetch items' });
  }
});

// POST route to handle incoming messages
app.post('/items', async (req, res) => {
  const { message, author } = req.body; // Extract message and author from the request body
  console.log(`Received message: "${message}" from author: "${author}"`);

  try {
      // Create a new item instance
      const newItem = new Item({ message, author });

      // Save the item to the database
      await newItem.save();

      // Respond with the saved data
      res.json({
          status: 'success',
          data: newItem,
      });
  } catch (error) {
      console.error('Error saving item to MongoDB:', error);
      res.status(500).json({ status: 'error', message: 'Failed to save item' });
  }
});

app.delete('/items/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Use the Mongoose model to delete the document
    const result = await Item.deleteOne({ _id: id });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Document deleted successfully' });
    } else {
      res.status(404).json({ message: 'Document not found' });
    }
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
