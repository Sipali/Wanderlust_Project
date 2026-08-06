const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const { category, search } = req.query;
  let filter = {};

  if (category && category.trim() !== "") {
    filter.category = category;
  }

  if (search && search.trim() !== "") {
    const searchRegex = new RegExp(search.trim(), "i");
    filter.$or = [
      { title: searchRegex },
      { location: searchRegex },
      { country: searchRegex }
    ];
  }

  const allListings = await Listing.find(filter);
  res.render("./listings/index", {
    allListings,
    selectedCategory: category || "",
    searchQuery: search || ""
  });
}

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
        select: "username"
      }
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  const allListings = await Listing.find().populate({
    path: "reviews",
    populate: {
      path: "author",
      select: "username"
    }
  });

  res.render("./listings/show.ejs", { listing, allListings });
}

async function geocodeLocation(locationStr, countryStr) {
  try {
    const query = encodeURIComponent(`${locationStr || ""}, ${countryStr || ""}`);
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`, {
      headers: {
        "User-Agent": "WanderlustApp/1.0"
      }
    });
    const data = await response.json();
    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      return {
        type: "Point",
        coordinates: [lon, lat]
      };
    }
  } catch (err) {
    console.error("Backend Geocoding Error:", err);
  }
  return {
    type: "Point",
    coordinates: [75.7873, 26.9124]
  };
}

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  newListing.geometry = await geocodeLocation(newListing.location, newListing.country);

  await newListing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image ? listing.image.url : "";
  if (originalImageUrl && originalImageUrl.includes("/upload/")) {
    originalImageUrl = originalImageUrl.replace("/upload/", "/upload/w_250,h_150,c_fill/");
  }

  res.render("./listings/edit.ejs", { listing, originalImageUrl });
}

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

  if (req.body.listing && (req.body.listing.location || req.body.listing.country)) {
    listing.geometry = await geocodeLocation(listing.location, listing.country);
  }

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }

  await listing.save();

  req.flash("success", "Listing Updated!");
  res.redirect("/listings");
}

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
}