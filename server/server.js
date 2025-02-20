const express = require ("express");
const dbConnection = require("./dbConnect/dbConnection");
const cors = require('cors');
const app = express();
const routes = require("./routes/routes");


const PORT = process.env.PORT || 4000;
app.use(cors({
    origin: '*', // Allow both Expo dev server and web
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));
app.use(express.json());

app.use("/",routes)

app.get("/",(req,res)=>{

    res.send("Hello World");

})
 
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    dbConnection();
});
