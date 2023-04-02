const agg = [
  {
    $match: {
      product: ObjectId("6427c89976d66b0490cea8f9"),
    },
  },
  {
    $group: {
      _id: null,
      averageRating: {
        $avg: "$rating",
      },
      numOfReviews: {
        $sum: 1,
      },
    },
  },
];
