import { app } from './app.js'
import { env } from './config/env.js';
import { connectDB } from './config/database.js';

const PORT = env.port;


const startServer = async () => {
  await connectDB();

  
  app.listen(PORT, (error) => {
    if (error) {
        if (error instanceof Error) {
            console.error("Error starting server:", error.message);
        }   else {
            console.error("Error starting server:", error);
        }
    }
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();

