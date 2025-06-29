import express from "express"
import cors from "cors"
import dotenv from "dotenv/config"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import passport from "passport"
import connect from "./db/db.js"
import userRoutes from './routes/user.routes.js'
import mediaRoutes from './routes/media.routes.js'
import localMediaRoutes from './routes/local-media.routes.js'
import authRoutes from './routes/auth.routes.js'
import './config/passport.js' // Import passport config
connect()
const app = express()
app.use(express.json())
app.use(cors({
  origin: ['http://localhost:5173', 'https://photo-detector-frontend.onrender.com'],
  credentials: true
}));
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(morgan("dev"))

// Initialize passport
app.use(passport.initialize())

app.use("/users", userRoutes)
app.use("/media", mediaRoutes)
app.use("/local-media", localMediaRoutes)
app.use("/api/auth", authRoutes)

app.get("/",(req,res)=>{
    res.send("hello world")
})

export default app