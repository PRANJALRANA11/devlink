import express from 'express'
import cookieparser from 'cookie-parser'
import cors from 'cors'
const app = express()

app.use(cors({
    origin: "*",
    credentials: true
}))
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded())
app.use(express.static("public"))
app.use(cookieparser())

// Routes
import router from './routers/user.routes.js'
app.use("/api/v1/user", router)



export { app }