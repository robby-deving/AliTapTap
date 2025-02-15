const express = require ("express");
const dbConnection = require("./dbConnect/dbConnection");
const app = express();
const routes = require("./routes/routes");

const PORT = process.env.PORT || 4000;

// ✅ Add this before defining routes:
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use("/",routes)

app.get("/",(req,res)=>{

    res.send("Hello World");

})
 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    dbConnection();
});