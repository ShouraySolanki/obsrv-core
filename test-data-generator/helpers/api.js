var axios = require("axios");
var fs = require('fs').promises;
var os = require("os");
require("dotenv").config();

const sendRequest = ({ body, headers = {} }) => {
  var data = {
    "data": body
  }

  var config = {
    method: "post",
    url: "http://localhost:8999/obsrv/v1/data/arundhati-choopu",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    data: data,
  };
  return axios(config);

  // return fs.appendFile("test.json", JSON.stringify(body, 0) + os.EOL, 'utf8');
};

const writeToFile = ({ body, headers = {} }) => {

  return fs.appendFile("test.json", JSON.stringify(body, 0) + os.EOL, 'utf8');
};

module.exports = { sendRequest, writeToFile };