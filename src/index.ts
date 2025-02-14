import { PORT } from "./utils/dotenv"
import express, {Request, Response} from "express"
import { StatusCodes } from "http-status-codes"

const app = express()

app.get("/",(req:Request, res:Response)=>{
  res.status(StatusCodes.OK).send()
})

app.listen(PORT,()=>{
  console.log(`Listening on:\nhttp://localhost:${PORT}/`)
})