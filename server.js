import express from 'express'
import mongoose from 'mongoose'
import Cors from 'cors'
import Messages from './dbMessages.js'
import Pusher from 'pusher'

const app = express()
const port = process.env.PORT || 9000
const connection_url = 'mongodb+srv://khoi2pham:matnaden@cluster0.exlyxrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

// For pusher
const pusher = new Pusher({
    appId: "1785322",
    key: "67e04ac25de523ac99c0",
    secret: "b196ba898446bf6bad2e",
    cluster: "us3",
    useTLS: true
});

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

const db = mongoose.connection
db.once("open", () => {
    console.log("DB Connected")
    const msgCollection = db.collection("messagingmessages")
    const changeStream = msgCollection.watch()
    changeStream.on('change', change => {
        console.log(change)
        if(change.operationType === "insert"){
            const messageDetails = change.fullDocument
            pusher.trigger("messages", "inserted",{
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received
            })
        } else{
            console.log('Error triggering Pusher')
        }
    })
})

//Listener
app.listen(port, () => console.log(`Listening on localhost: ${port}`))