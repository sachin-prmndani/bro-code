import dotenv from 'dotenv'
dotenv.config();

const ENV = {
  DB_URL: process.env.DB_URL,
  PORT:process.env.PORT,
  PISTON_URL: process.env.PISTON_API,
  
};

export default ENV;
