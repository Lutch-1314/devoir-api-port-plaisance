const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.getAllUsers = async () => {
  return User.find({}, { password: 0 });
};

exports.getUserByEmail = async (email) => {
  return User.findOne({ email });
};

exports.addUser = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return User.create({ ...data, password: hashedPassword });
};

exports.updateUser = async (email, data) => {
  const user = await User.findOne({ email });
  if (!user) return null;

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  Object.assign(user, data);
  return user.save();
};

exports.deleteUser = async (email) => {
  return User.deleteOne({ email });
};