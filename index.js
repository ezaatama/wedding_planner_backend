const express = require("express");
const cors = require("cors");
const session = require("express-session");
const dotEnv = require("dotenv");
const bodyParser = require("body-parser");
const app = express();
const MIGRATE = require("./config/migration.js");

dotEnv.config();

MIGRATE;

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

app.listen(process.env.APP_PORT, () => {
    console.log(`Example app listening on port ${process.env.APP_PORT}`);
});