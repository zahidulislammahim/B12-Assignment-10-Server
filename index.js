const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();

const app = express()
const port = process.env.PORT || 3000


app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1yqh2qi.mongodb.net/?appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const db = client.db("b12-Assignment-10-db");
    const issuesCollection = db.collection("issues");

    //get all issues
    app.get('/issues', async(req,res) =>{
      const result = await issuesCollection.find().toArray();
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Community Cleanliness & Issue Reporting Portal Server is running.');
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})