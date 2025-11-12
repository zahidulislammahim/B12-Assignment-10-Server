const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1yqh2qi.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("b12-Assignment-10-db");
    const issuesCollection = db.collection("issues");
    const contributionCollection = db.collection("contribution");

    //get all issues
    app.get("/issues", async (req, res) => {
      const result = await issuesCollection.find().toArray();
      res.send(result);
    });

    //get issue by id
    app.get("/issues/:id", async (req, res) => {
      const { id } = req.params;
      const result = await issuesCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    //get all Contribution
    app.get("/contribution", async (req, res) => {
      const result = await contributionCollection.find().toArray();
      res.send(result);
    });

    //post an issue
    app.post("/issues", async (req, res) => {
      const data = req.body;
      const result = await issuesCollection.insertOne(data);
      res.send(result);
    });
    //post an Contribution
    app.post("/contribution", async (req, res) => {
      const data = req.body;
      const result = await contributionCollection.insertOne(data);
      res.send(result);
    });

    //Update MY Issues
    app.put("/issues/:id", async (req, res) => {
      const { id } = req.params;
      const data = req.body;

      const update = {
        $set: data,
      };
      const result = await issuesCollection.updateOne(
        { _id: new ObjectId(id) },
        update
      );
      res.send(result);
    });

    //Delete My Issues
    app.delete("/issues/:id", async (req, res) => {
      const { id } = req.params;
      const result = await issuesCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Community Cleanliness & Issue Reporting Portal Server is running.");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
