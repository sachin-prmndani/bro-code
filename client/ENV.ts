import dotenv from 'dotenv'
dotenv.config();

const ENV = {
  VITE_API_URL:process.env.VITE_API_URL,
  
};

export default ENV;
