const express = require("express");
const cors = require("cors");
const session = require("express-session");
const dotEnv = require("dotenv");
const bodyParser = require("body-parser");
const app = express();
const userRoutes = require("./routes/users/users");
const authRoutes = require("./routes/auth/auth");
const weddingRoutes = require("./routes/wedding/wedding");
const responseMiddleware = require("./middleware/response");
// const MIGRATE = require("./config/migration.js");

dotEnv.config();

//MIGRATION DB
// MIGRATE;

app.use(
    session({
        secret: process.env.SESS_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
          //jika menggunakan https atur secure jadi true
          //karna disini masih local menggunakan http maka secure jadi false
          secure: false,
          sameSite: "none",
          maxAge: 60 * 60 * 1000 // 24 jam
        },    
    })
);

const corsOptions = {
    exposedHeaders: ["Authorization", "x-access-token"],
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 204,
  };

app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use("/public/assets/images", express.static("public/assets/images/"));

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message,
      },
    });
  });

app.get('/', function(req, res) {
    res.send("Init API");
});

app.use(responseMiddleware);
app.use(userRoutes);
app.use(authRoutes);
app.use(weddingRoutes);

app.listen(process.env.APP_PORT, () => {
    console.log(`Example app listening on port ${process.env.APP_PORT}`);
});