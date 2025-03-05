const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const connectdb = require('./ConnectDb/connectDb');

const port = process.env.PORT;  // 🔹 REMOVE DEFAULT VALUE (Render assigns this dynamically)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const CodeRouter = require('./Routes/routes');
app.use('/code', CodeRouter);

const start = async () => {
    try {
        await connectdb(process.env.MONGO_URI);
        app.listen(port, '0.0.0.0', () => {  // 🔹 Ensure server binds to "0.0.0.0"
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();
