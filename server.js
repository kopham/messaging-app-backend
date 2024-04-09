import express from 'express'
import mongoose from 'mongoose'
import Cors from 'cors'
import Messages from './dbMessages.js'

//App Config
const app = express()
const port = process.env.PORT || 9000
const connection_url = 'mongodb+srv://khoi2pham:matnaden@cluster0.exlyxrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

//Middleware
app.use(express.json())
app.use(Cors())

//DB Config
mongoose.connect(connection_url, {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Connected to MongoDB");
})
.catch(error => {
    console.error("Error connecting to MongoDB:", error);
});

//API Endpoints
app.get("/", (req, res) => res.status(200).send("Hello The Web Dev"))

app.post('/messages/new', async (req, res) => {
    try {
        const dbMessage = req.body
        const createdMessage = await Messages.create(dbMessage)
        res.status(201).send(createdMessage)
    }catch (err) {
        res.status(500).send(err)
    }
})

app.get('/messages/sync', async (req, res) => {
    try{
        const messages = await Messages.find()
        res.status(200).send(messages)
    }catch (err){
        res.status(500).send(err)
    }
})

//Listener
app.listen(port, () => console.log(`Listening on localhost: ${port}`))