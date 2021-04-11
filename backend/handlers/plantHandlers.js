let plants = require("../data/plants.json");

const getPlants = (req, res) => {
  res.status(200).json({ status: 200, data: plants });
};

module.exports = { getPlants };
