const { MongoClient } = require("mongodb");

const uri =
  `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.URL}/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri);
const database = client.db('Headstarter');

const db = {
    jobs: database.collection('jobs')
}

module.exports = db;