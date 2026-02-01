const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const authMiddleware = require("./middlewares/RBAC/authMiddleware");
const rbacMiddleware = require("./middlewares/RBAC/rbacMiddleware");
dotenv.config();

const app = express();

app.use(cookieParser());

const allowedOrigins = ['https://be-homes.vercel.app', 'http://localhost:5000/', 'http://localhost:3000']; // Add other allowed origins if needed

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Custom-Header'],
  credentials: true
};

// Use corsOptions when calling cors()
app.use(cors(corsOptions));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs');
a



app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 60000, // ⏳ Increase timeout to 60 seconds
  socketTimeoutMS: 60000,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));
app.use('/project', require('./routes/project'));

app.use("/presentation/", require("./routes/presentation"));
//app.use("/quotation/", require("./routes/quotation"));
//app.use("/measurement/", require("./routes/mesaurement"));  


//app.use("/purchase/", require("./routes/purchase"));
//app.use("/materialRecieved/", require("./routes/materialRecieved"));

//app.use("/dispatch/", require("./routes/dispatch"));

app.use("/executinPlanning/", require("./routes/executinPlanning"));
//app.use("/payment/", require("./routes/payment"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));