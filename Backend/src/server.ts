import express from 'express'
import cores from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import connectDB from './config/db'
import router from './routes/router'
import bodyParser from 'body-parser';
import  {errorHandler } from './middleware/errorHander'

const app = express()
const port = process.env.PORT || 5000
connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser())
app.use(bodyParser.raw({ type: 'application/json' }));
app.use(cores({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use('/',router)

app.get('/', (req, res) => { 
    res.send('hello the server is ruuning ....')
})
app.use(errorHandler);
app.listen(port , ()=> console.log(`server is started on port : ${port}`))