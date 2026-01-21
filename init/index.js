const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main(){
    await mongoose.connect(MONGO_URL);
}
main()
   .then(() => console.log("connected to db"))
   .catch(err => console.log(err));

    const initDB = async () => {
    await Listing.deleteMany({});

    const sampleData = initData.data.map((obj, idx) => ({
    ...obj,
    owner: "691dd3c5bd45d0c981843394",
    geometry: {
        type: "Point",
        coordinates: [
            -118.2437 + idx * 0.02,   // longitude
            34.0522 + idx * 0.02      // latitude
        ]
    }

}));

    await Listing.insertMany(sampleData);
    console.log("data was initialized");
};

initDB();
