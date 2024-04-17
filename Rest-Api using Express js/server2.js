const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());


const MONGO_URI = 'mongodb://127.0.0.1:27017';  
const MONGO_DB_NAME = 'rushi';  
const MONGO_COLLECTION_NAME = 'dbcollection';


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
        const data = await collection.find({}).toArray();
	const count = await collection.countDocuments();
	console.log("Number of documents in collection:", count);

      res.json(data);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch data', error: err.message });
    }
  });



  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
