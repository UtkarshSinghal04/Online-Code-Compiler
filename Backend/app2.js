const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const connectdb = require('./ConnectDb/connectDb')
const port = process.env.PORT || 5000
const CodeRouter = require('./Routes/routes')


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use('/code', CodeRouter)

const start = async () => {
    try {
        await connectdb(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`server is listening on ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()
