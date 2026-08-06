const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const categories = [
  "Trending",
  "Rooms",
  "Iconic Cities",
  "Castles",
  "Mountains",
  "Amazing Views",
  "Farms",
  "Beach",
  "Camping",
  "Arctic",
  "Domes",
  "Boats"
];

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj, idx) => ({
    ...obj,
    owner: "691764a3e9c43e633b4c3c3a",
    category: obj.category || categories[idx % categories.length],
    geometry: obj.geometry || {
      type: "Point",
      coordinates: [75.7873, 26.9124]
    }
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized with categories");
};

initDB();