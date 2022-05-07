const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();

//for middleware
app.use(cors());
app.use(express.json());

//Connection to cluster
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rc27j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
      await client.connect();
      //database connection
      const userCollection = client.db("biCycleCollection").collection("biCycles");
      
      //send data for API Show
      app.get("/user", async(req, res)=>{
        const query = {};
        const cursor = userCollection.find(query);
        const user = await cursor.toArray();
        res.send(user);
      })
  
  
    } finally {
      //await clint.close();
    }
  }
  run().catch(console.dir);
  



app.get("/", (req, res) => {
  res.send("hello, i am running");
});

app.listen(port, () => {
  console.log("Server connecting");
});
