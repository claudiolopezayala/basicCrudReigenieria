import { db } from "./db/connection.db"
import { PORT } from "./utils/dotenv"
import express, {Request, Response} from "express"
import { StatusCodes } from "http-status-codes"
import {testTable} from "./db/schemas/testSchema"

const app = express()

app.use(express.json());

app.get("/",async (req:Request, res:Response)=>{
  await db
    .insert(testTable)
    .values({})

  const values = await db
    .select()
    .from(testTable)
    
  res.json(values).status(StatusCodes.OK).send()
})

app.listen(PORT,()=>{
  console.log(`Listening on:\nhttp://localhost:${PORT}/`)
})