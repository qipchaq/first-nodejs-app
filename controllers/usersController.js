const User = require("../model/User");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
  const users = await User.find();
  if (!users) return res.status(204).json({ "message": "No users found." });
  res.json(users);
};

const getUser = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ "message": "User ID required" });
  }
  const user = await User.findOne({ _id: req.params.id }).exec();
  if (!user)
    return res
      .status(204)
      .json({ "message": `No user matches ID ${req.params.id}` });
  res.json(user);
};

const deleteUser = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ "message": "User ID required" });
  }
  const user = await User.findOne({ _id: req.body.id }).exec();
  if (!user)
    return res
      .status(204)
      .json({ "message": `No user matches ID ${req.body.id}` });
  const result = await User.deleteOne({ _id: req.body.id });
  res.json(result);
};

const updateUser = async (req, res) => {
  const { username, roles, pwd } = req?.body;
  if (!req?.body?.id)
    return res.status(400).json({ "message": "User ID required" });
  if (!username && !roles && !pwd)
    return res
      .status(400)
      .json({ "message": "Required username or roles or pwd" });

  const user = await User.findOne({ "_id": req.body.id });
  if (!user)
    return res
      .status(204)
      .json({ "message": `No user matches ID ${req.body.id}` });

  if (username) user.username = username;
  if (pwd) {
    const hashedPwd = await bcrypt.hash(pwd, 10);
    user.password = hashedPwd;
  }
  if (roles) {
    switch (roles) {
      case "Admin":
        user.roles = { ...user.roles, "Admin": 5150 };
        break;
      case "Editor":
        user.roles = { ...user.roles, "Editor": 1984 };
        break;
    }
  }
  const result = await user.save();
  res.json(result);
};

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
  getUser,
};
