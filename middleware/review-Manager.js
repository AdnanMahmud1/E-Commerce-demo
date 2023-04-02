const Review = require("../models/Review");

const getReviews = async (id) => {
  const reviews = await Review.find({ product: id });
  return reviews;
};

module.exports = getReviews;
