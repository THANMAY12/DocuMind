require("dotenv").config();
const express=require("express");
const cors=require("cors");

const app=express();
app.use(cors());
app.use(express.json());


app.get("/api/health",(req,res)=>{

    res.json({
        success: true,
        message: "DocuMind API is running"
    });
});

app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
});