const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
  
     //single product load
     app.get('/user/:id', async(req, res) =>{
         const id = req.params.id;
         const query = {_id: ObjectId(id)};
         const user = await userCollection.findOne(query)
         res.send(user);
     })

     //ADD Products
     app.post("/user", async(req, res) => {
      const newUser = req.body;
      //insert data in database
      const product = await userCollection.insertOne(newUser);
      res.send(product);
    });

    //delete a product
    app.delete('/user/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)}
      const product = await userCollection.deleteOne(query);
      res.send(product);
    });

    
    //update quantity
    app.get('/user/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await userCollection.findOne(query);
      res.send(result);
    })
	
    app.put('/user/:id', async(req, res) =>{
      const id = req.params.id;
      const update_quantity = req.body;
      const filter = {_id: ObjectId(id)}
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          quantity : update_quantity.quantity,
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })

    //myItems
    app.get('/items', async(req, res) =>{
      const email = req.query.email;
      const query = {email : email}
      const items = await userCollection.find(query).toArray();
      res.send(items);
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
