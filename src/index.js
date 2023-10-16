const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')

app.use(cors({
    origin: '*'
}));

app.use(bodyParser.json()) //entender JSON
app.use(bodyParser.urlencoded({ extended: false })) //entender parms via URL

require('./controllers/authController')(app)
require('./controllers/productController')(app)
require('./controllers/storeController')(app)
require('./controllers/stockController')(app)
require('./controllers/typeUserController')(app)
require('./controllers/orderController')(app)

app.listen(3091)






