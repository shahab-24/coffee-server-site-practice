const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 3000;

// middleweares===================================
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_COFFEE_USERS}:${process.env.DB_PASS}@cluster0.3jtn0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client.db("Coffees").collection("coffee");

    app.get("/coffee", async (req, res) => {
      const newCoffee = await coffeeCollection.find().toArray();
      res.send(newCoffee);
    });

    app.get("/coffee/:id", async(req, res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};
        const result = await coffeeCollection.findOne(query);
        res.send(result)
    })
    app.put("/updateCoffee/:id", async(req, res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};
        const options = {upsert : true}
        const coffee = req.body;
        const updatedCoffee = {
            $set: {
                 name:coffee.name,
                 photo: coffee.photo, 
                 chef: coffee.chef, 
                 category: coffee.category, 
                 supplier: coffee.supplier, 
                 test: coffee.test 
            }
        }
        const result = await coffeeCollection.updateOne(query,updatedCoffee, options,);
        res.send(result)
    })



    app.post("/addCoffee", async (req, res) => {
      const coffee = req.body;
      const newCoffee = await coffeeCollection.insertOne(coffee);
      res.send(newCoffee);
    });

    app.delete('/coffee/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};
        const result = await coffeeCollection.deleteOne(query);
        res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  //   console.log(`Coffee server is runnning on port: ${port}`);
  res.send(`Coffee server is runnning on port: ${port}`);
});

app.listen(port, () => {
  console.log(`server is listening to your`);
});
