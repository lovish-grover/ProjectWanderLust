const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlast";

main()
    .then(() => {
        console.log("connected to Db");
    })
    .catch((err) => {
        console.log(err);
    })


async function main() {
    await mongoose.connect(MONGO_URL);
}


const initDb = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "6657911d13c6ba1d6aab8611",
    }))
    await Listing.insertMany(initData.data);
    console.log("data initialized ");
}

initDb();