import express from 'express'
import connectDB from './config/db.js';
import dotenv from 'dotenv'
import userRouter from './routes/UserRoutes.js';
import webhookRouter from './routes/webhookRoutes.js';
import roomRoutes from './routes/roomRoutes.js';


const app = express();
const PORT = 3000;
app.use(express.json());
dotenv.config()
await connectDB()


app.use('/api/webhooks',webhookRouter)
app.use('/api/users',userRouter);
app.use('/api/rooms',roomRoutes);

app.listen(PORT,()=>{
    console.log(`http-server running on http://localhost:${PORT}`)
})