import { PORT } from "./utils/dotenv"
import express, {Request, Response} from "express"
import { router } from "./routes/app.routes"
import cors from "cors";

const app = express()

app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/", router);

app.listen(PORT,()=>{
  console.log(`Listening on:\nhttp://localhost:${PORT}/`)
})