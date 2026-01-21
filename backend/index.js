const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
require('./config/db');
const UserRoute=require('./routes/UserRoutes')
const InventoryRoute=require('./routes/InventoryRoute')
const ProductionRoute=require('./routes/ProductionRoute')
const AdminRoute=require('./routes/AdminRoutes')
const TableRoute=require('./routes/TableRoutes')
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use('/api',UserRoute)
app.use('/api',InventoryRoute)
app.use('/api',ProductionRoute)
app.use('/api',AdminRoute)
app.use('/api',TableRoute)


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
