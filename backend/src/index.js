import dotenv from 'dotenv'
import connectDB from './config/database.js'
import app from './app.js'
import dns from 'node:dns'

dns.setServers(['8.8.8.8', '8.8.4.4'])

dotenv.config({
    path: './.env'
})

const startServer = async () =>{
    try {
        await connectDB()
        app.on("error", (error)=>{
            console.error("Error", error)
            throw error
        })
        app.listen(process.env.PORT || 8000, ()=>{
            console.log(`Server running on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.error('MongoDB connection failed', error);
    }
}

startServer()