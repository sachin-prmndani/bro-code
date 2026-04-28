import dotenv from 'dotenv'
dotenv.config();

const ENV = {
  DB_URL: process.env.DB_URL,
  
};

export default ENV;