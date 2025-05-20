import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import notFound from './app/middlewares/notFound'
import globalErrorHandler from './app/middlewares/globalErrorHandler'
import router from './app/routes'
import cookieParser from 'cookie-parser'

const app: Application = express()

app.use(express.json())
//added by mirza nahid
app.use(cookieParser())
app.use(
  cors({
    origin: ['https://papyrus-client.vercel.app','http://localhost:5173'],
    credentials: true,
  }),
)

// Application Routes
app.use('/api', router)
const getController = async (req: Request, res: Response) => {
  res.send('Welcome to Papyrus!')
}

app.get('/', getController)
app.use(globalErrorHandler)
app.use(notFound)

export default app
