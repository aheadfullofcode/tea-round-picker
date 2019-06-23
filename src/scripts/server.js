const express = require("express"),
  app = express(),
  bodyParser = require("body-parser");

const fileRoutes = require("../routes/file-upload");

// const url = `mongodb://${config.DB_USER}:${config.DB_PASSWORD}@${
//   config.DB_URI
// }`;

// mongoose.connect(url).then(() => {
//   if (process.env.NODE_ENV != "production") {
//     fakeDB.seed();
//   }
// });

app.use(bodyParser.json()); // use od body parser to get values from get req

app.use("/api/v1/", fileRoutes);

app.listen(8080, function() {
  console.log("Node server started on port " + 8080);
});
