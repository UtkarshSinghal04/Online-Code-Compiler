const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const connectdb = require('./ConnectDb/connectDb');

const port = process.env.PORT;  // 🔹 REMOVE DEFAULT VALUE (Render assigns this dynamically)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'https://online-code-compiler-zjt7-a7d6bgnk9-utkarsh-singhals-projects.vercel.app/',
    methods: ['GET', 'POST']
  }));

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
