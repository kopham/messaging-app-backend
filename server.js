import express from 'express'
import mongoose from 'mongoose'
import Messages from './dbMessages.js'

//App Config
const app = express()
const port = process.env.PORT || 9000
const connection_url = 'mongodb+srv://khoi2pham:matnaden@cluster0.exlyxrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

//Middleware
//DB Config
mongoose.connect(connection_url, {
    useNewUrlParser: true,
    // useCreateIndex: true,
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

app.post('/messages/new', (req, res) => {
    const dbMEssage = req.body
    Messages.create(dbMessage, (err, data) => {
        if(err){
            res.status(500).send(err)
        }
        else{
            res.status(201).send(data)
        }
    })
})

app.get('/messages/sync', (req, res) => {
    Messages.find((err,data) => {
        if(err){
            res.status(500).send(err)
        }
        else{
            res.status(200).send(data)
        }
    })
})  

//Listener
app.listen(port, () => console.log(`Listening on localhost: ${port}`))