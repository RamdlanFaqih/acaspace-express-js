import { Pool } from "pg"
import 'dotenv/config'

export const db = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: Number(process.env.PORT),
})

db.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch((err) => console.log("Connection error", err))