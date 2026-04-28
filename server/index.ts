import dotenv from 'dotenv'
dotenv.config();
import express from 'express';
import ENV from './ENV.js'
import connectDB from './utils/mongoose.js';

const app = express();

app.use(express.json());
connectDB();


app.get('/', (_req: any, res: any) => {
  res.send('API running');
});



