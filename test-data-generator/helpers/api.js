var axios = require("axios");
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
};

module.exports = { sendRequest };
