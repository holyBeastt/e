const express = require("express");
const path = require("path");
require("dotenv").config();
const session = require("express-session");
const login = require("./routes/loginRoute");
//const importFile = require("./routes/importRoute");
//console.log("> check env: ", process.env);

// Connect to database
const connection = require("./config/database");

// config engine template
const configViewEngine = require("./config/viewEngine");

// const webRoutes = require("./routes/web");

const webRoutes = require("./routes/web");

const app = express();
const port = process.env.port || 8888;
const hostname = process.env.HOST_NAME;

// config engine template
configViewEngine(app);

// cấu hình session cho login
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // set secure: true nếu bạn sử dụng HTTPS
  })
);

// config res.body
app.use(express.json()); // for json
app.use(express.urlencoded({ extended: true })); // for form data

// Khai bao route
app.use("/", webRoutes);
app.use("/", login);

app.listen(port, hostname, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Phục vụ các file tĩnh từ thư mục node_modules
// app.use("/node_modules", express.static(path.join(__dirname, "/node_modules")));
app.use(express.static(path.join(__dirname, "../node_modules")));
app.use(express.static(path.join(__dirname, "public/images")));

// simple query
// connection.query("SELECT * FROM `bomon`", function (err, results, fields) {
//   // console.log("result = ", results); // results contains rows returned by server
//   // console.log(fields); // fields contains extra meta data about results, if available
//   // Chuyển đổi kết quả thành JSON
//   // const jsonData = JSON.stringify(results);

//   // // In ra dữ liệu dưới dạng JSON
//   // console.log("Data in JSON format: ", jsonData);
// });

// == src of L ==
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public/js"))); // cấu hình tệp js
app.use(express.json()); // Thêm dòng này để xử lý JSON

const importFile = require("./routes/importRoute");
app.use("/", importFile); // cấu hình import
