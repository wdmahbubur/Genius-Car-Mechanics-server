const express = require('express');
const cors = require('cors');
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config()
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

app.get('/', (req, res) => {
    res.send("Genius Car Mechanics Server Running");
})

const uri = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.ni4ot.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function serverRun() {
    try {
        await client.connect();

        const database = client.db("geniusCarMechanics");
        const collection = database.collection("services");

        //GET Service
        app.get('/services', async (req, res) => {
            const data = collection.find({});
            const services = await data.toArray();
            res.send(services);
        })

        //Service Add
        app.post('/add-new-service', async (req, res) => {
            const service = req.body;
            const result = await collection.insertOne(service)
            res.send(result);
        })


        //DELETE Service
        app.delete('/delete-service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await collection.deleteOne(query);
            res.send(result);
        })


    }
    finally {
        // await client.close();
    }
}
serverRun().catch(console.dir);

app.listen(port);
