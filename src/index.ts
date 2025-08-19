// const express = require('express')
import express from 'express'
import cors from 'cors'
import productRoutes from './routes/product.router'

const app = express()
const port = 3000


app.use(express.json())
app.use(cors())

app.get('/api', (req, res) => {
  res.send('Hello World!')
})

app.use("/api/products", productRoutes)
// app.use("/app/users", userRoutes)

app.listen(port, () => {
    console.log(`API ready to use on port ${port}`);
})