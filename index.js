const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

// mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ufdxsbo.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
const dbConnect = async () => {
  try {
    await client.connect();
    console.log("Database Connected");
  } catch (error) {
    res.send({
      success: false,
      error: error.message
    })
  }
}

dbConnect();


// default get
app.get('/', (req, res) => {
  res.send("Task management server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
})