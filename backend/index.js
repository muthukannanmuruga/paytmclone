const express = require("express");
const rootRouter = require("./routes/index")
const cors= require("cors")

//backend port 3000

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/v1", rootRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  
  // Event listener for handling errors during app startup
  app.on('error', (err) => {
    console.error(`Error starting the server: ${err.message}`);
  });



