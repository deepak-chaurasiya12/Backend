const connectToMongo = require("./db");
connectToMongo();
const express = require('express')
var cors = require('cors')

const app = express()
const port = 5000



const corsOptions = {
  origin: ["https://frontend-deploy-nu.vercel.app"],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

app.use(cors(corsOptions));




app.get('/', (req, res) => {
  res.send('Hello backend server people!')
})

app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

// app.get('/api/v1/login', (req, res) => {
//   res.send('Pleae login here')
// })

// app.get('/api/v1/signin', (req, res) => {
//   res.send('Please signup here!')
// })

app.listen(port, () => {
  console.log(`eNotebook listening on port http://localhost:${port}`)
})


