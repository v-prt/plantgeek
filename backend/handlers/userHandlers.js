const users = require("../data/users.json");

const getUsers = (req, res) => {
  res.status(200).json({ status: 200, data: users });
};

module.exports = { getUsers };
