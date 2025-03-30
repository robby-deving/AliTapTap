const express = require('express');
const router = express.Router();
//do user functions here

router.get("/get-users",(req,res)=>{ 
    res.send("User info has been fetch");
})

module.exports = router;