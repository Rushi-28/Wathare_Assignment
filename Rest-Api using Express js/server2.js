const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// MongoDB connection settings
const MONGO_URI = 'mongodb://127.0.0.1:27017';  
const MONGO_DB_NAME = 'rushi';  
const MONGO_COLLECTION_NAME = 'dbcollection';

// Connect to MongoDB
(async () => {
  let db;
  try {
    const client = new MongoClient(MONGO_URI, {
      useNewUrlParser: true, 
      useUnifiedTopology: true
    });
    await client.connect();
    console.log("Connected to MongoDB",MONGO_URI);
    db = client.db(MONGO_DB_NAME);
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err}`);
    process.exit(1);
  }

  // Routes
  app.get('/data', async (req, res) => {
    try {
      const collection = db.collection(MONGO_COLLECTION_NAME);
console.log("Database:", db.databaseName);
console.log("Collection:", MONGO_COLLECTION_NAME);
console.log("Query:",collection.find({}).toArray());
      const data = await collection.find({}).toArray(); // Properly fetching all documents
		const count = await collection.countDocuments();
console.log("Number of documents in collection:", count);

      res.json(data);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch data', error: err.message });
    }
  });



app.post('/add-data', async (req, res) => {
  try {
    const { documents } = req.body; // Assuming an array of documents is sent in the request body

    if (!Array.isArray(documents)) {
      return res.status(400).json({ message: 'Invalid data format. Expected an array of documents.' });
    }

    const collection = db.collection(MONGO_COLLECTION_NAME);
    const result = await collection.insertMany(documents);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to insert data', error: err.message });
  }
});



  // Starting the server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
