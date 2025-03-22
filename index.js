const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const app = express();
require('dotenv').config()

const fs = require('fs');
const signFile = fs.readFileSync('../backend/dedupedBrooms.geojson');
// const signsObj = JSON.parse(signFile);

// console.log(signsObj[0][0])

require("./routes/dayRoutes.js")(app);
// ------ Setup middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
// ------ Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

const port = process.env.PORT || 5001;
app.listen(port);
console.log(`Listening on ${port}`);

// 40.81433-73.95158
// 40.72959° N, 73.98585