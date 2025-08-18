// const express = require('express')
import express, {Request, Response} from 'express'
import cors from 'cors'

const app = express()
const port = 3000


app.use(express.json())
app.use(cors())

app.listen(port, () => {
    console.log(`API ready to use on port ${port}`);
})