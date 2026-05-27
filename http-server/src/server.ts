import express from 'express'
import connectDB from './config/db.js';
import dotenv from 'dotenv'


const app = express();
const PORT = 3000;
app.use(express.json());
dotenv.config()
await connectDB()


app.post('/test',(req,res)=>{
    res.json({
        message:"This is working right now"
    })
})


app.listen(PORT,()=>{
    console.log(`http-server running on http://localhost:${PORT}`)
})