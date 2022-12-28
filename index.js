const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

// mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ufdxsbo.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

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

// mongodb document collections
const tasksCollection = client.db("taskManagement").collection("tasks");
const completedCollection = client.db("taskManagement").collection("completed");
const usersCollection = client.db("taskManagement").collection("users");

// post tasks data
app.post("/tasks", async (req, res) => {
  try {
    const tasksData = req.body;
    const result = await tasksCollection.insertOne(tasksData);

    res.send(result);

  } catch (error) {
    res.send({
      success: false,
      error: error.message
    })
  }
});

// get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const email = req.query.email;
    let query = {};

    if (email) {
      query = { userEmail: email }
    };

    const cursor = tasksCollection.find(query);
    const result = await cursor.toArray();

    res.send(result);

  } catch (error) {
    res.send({
      success: false,
      error: error.message
    })
  }
});

// get a single task
app.get('/task/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await tasksCollection.findOne(query);

    res.send(result);

  } catch (error) {
    res.send({
      success: false,
      error: error.message
    })
  }
});

// update a specific task
app.put("/task/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const taskInfo = req.body;
    const options = { upsert: true };

    const updatedDoc = {
      $set: taskInfo
    };

    const updatedTask = await tasksCollection.updateOne(query, updatedDoc, options);

    res.send(updatedTask);

  } catch (error) {
    res.send({
      success: false,
      error: error.message
    })
  }
})

// delete a specific task
app.delete("/task/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await tasksCollection.deleteOne(query);

    res.send(result);

  } catch (error) {
    res.send({
      success: false,
      error: error.message
    })
  }
});

// app.put('/completed', async (req, res) => {
//   try {
//     const query 
//   } catch (error) {
//     res.send({
//       success: false,
//       error: error.message
//     })
//   }
// })

// completed task
// app.post('/completed', async (req, res) => {
//   try {
//     const completedTask = req.body;
//     const result = await completedCollection.insertOne(completedTask);
//     res.send(result);
//   } catch (error) {
//     res.send({
//       success: false,
//       error: error.message
//     })
//   }
// });



// default get
app.get('/', (req, res) => {
  res.send("Task management server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
})