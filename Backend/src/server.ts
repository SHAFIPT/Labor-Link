import express from 'express'
import cores from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import connectDB from './config/db'
import router from './routes/router'

const app = express()
const port = process.env.PORT || 5000
connectDB()

app.use(express.json())
app.use(cookieParser())
app.use(cores({ credentials: true }))

app.use('/',router)

app.get('/', (req, res) => { 
    res.send('hello the server is ruuning ....')
})

app.listen(port , ()=> console.log(`server is started on port : ${port}`))