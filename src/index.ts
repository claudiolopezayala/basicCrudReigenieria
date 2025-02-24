import { db } from "./db/connection.db"
import { PORT } from "./utils/dotenv"
import express, {Request, Response} from "express"
import { StatusCodes } from "http-status-codes"
import {testTable} from "./db/schemas/testSchema"
import { router } from "./routes/app.routes"

const app = express()

app.use(express.json());

app.use("/", router);

app.listen(PORT,()=>{
  console.log(`Listening on:\nhttp://localhost:${PORT}/`)
})