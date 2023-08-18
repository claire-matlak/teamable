// every node.js backend starts with these three constants + two app.use methods
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb')  // connects DB with backend code
// create a new mongodb client that talks to the server on this specific url
const { isEmptyPayload, isInvalidEmail } = require('./validator') // need the ./ to specify that it's our validator file

const { DB_USER, DB_PASS, DEV } = process.env
const dbAddress = '127.0.0.1:27017'
const url = DEV ? `mongodb://${dbAddress}` : `mongodb://${DB_USER}:${DB_PASS}@${dbAddress}?authSource=company_db`

const client = new MongoClient(url)
const dbName = "company_db"
const collName = "employees"

app.use(bodyParser.json())
app.use('/', express.static(__dirname + '/dist'))

app.get('/get-profile', async function(req, res) {
    // connect to mongodb
    await client.connect()
    console.log("Connected successfully to server")

    // initiate or get the database & collection
    const db = client.db(dbName)
    const collection = db.collection(collName)

    // get data from database
    const result = await collection.findOne({ id: 1 })
    console.log(result)
    client.close()
    
    response = {} // not const because the value will change
    if (result !== null) {
        // send the above info from the db through the backend to the frontend
        response = {
            name: result.name,
            email: result.email,
            interests: result.interests
        }
    }
    res.send(response) 
})

app.post('/update-profile', async function(req, res) {
    const payload = req.body
    console.log(payload)

    if (isEmptyPayload(payload) || isInvalidEmail(payload)) {
        res.send({error: "Invalid payload: Couldn't update user profile data"})
    } else {
        // connect to mongodb
        await client.connect()
        console.log("Connected successfully to server")

        // initiates or get the database & collection
        const db = client.db(dbName)
        const collection = db.collection(collName)

        // save payload data that frontend sent, to the database
        // if no existing document is found, make a new one (upsert: false)
        payload['id'] = 1
        const updatedValues = { $set: payload }
        await collection.updateOne({id: 1}, updatedValues, {upsert: true})
        client.close() // terminate the database connection

        res.send({info: "User profile data updated successfully"})
    }
})

const server = app.listen(3000, function () {
    console.log("app listening on port 3000")
})

module.exports = {
    app,
    server
}