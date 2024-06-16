import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'


const connectdb = async () => {
    try {
        const dbresponse = await mongoose.connect(`${process.env.MONGO_DB_URI}/${DB_NAME}`)
        console.log("MONGODB CONNECTED TO HOST :", dbresponse.connection.host)
    } catch (error) {
        console.log("MONGODB CONNECTION ERROR:", error.message)
        process.exit(1)
    }
}
export default connectdb