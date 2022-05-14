const { MongoClient } = require("mongodb");

const connect = async () => {
  try {
    const connection = await MongoClient.connect(process.env.MONGO_URI);
    console.log("Mongo connection established");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connect;
