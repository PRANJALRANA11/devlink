import dotenv from "dotenv";
import connectdb from "./db/connection.db.js";
import { app } from "./app.js";
dotenv.config();


connectdb().then(() => {
    app.listen(process.env.PORT || 8000 , () => {
        console.log("server started at port 8000")
    })
}).catch((err)=>{
    console.log("Mongodb connection failed",err)
});