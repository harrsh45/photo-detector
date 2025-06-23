import app from "./app.js"
import dotenv from "dotenv/config"
import jwt from "jsonwebtoken"
import http from "http"
import mongoose from "mongoose"

const PORT = process.env.PORT || 3000
const server=http.createServer(app)
server.listen(PORT,()=>{
    console.log(`the server is running on port ${PORT} `)
})







