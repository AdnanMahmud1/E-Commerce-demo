const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { createTokenUser, attatchCookiesResponse, checkPremissions } = require("../utils");

const getAllUsers = async (req, res) => {
  console.log(req.user);
  const users = await User.find({ role: "user" }).select("-passeord");
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");

  if (!user) {
    throw new CustomError.NotFoundError(`No user with Id: ${req.params.id}`);
  }
  checkPremissions(req.user, user._id)
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};
// update user with user.save()
const updateUsers = async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new CustomError.BadRequestError("Please provide all values");
  }

  const user = await User.findOne({ _id: req.user.userId });
  user.emai = email;
  user.name = name;

  await user.save();

  const tokenUser = createTokenUser(user);
  attatchCookiesResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please provide both values");
  }
  const user = await User.findOne({ _id: req.user.userId });

  const isPasswordCorrent = await user.comparePassword(oldPassword);
  if (!isPasswordCorrent) {
    throw new CustomError.UnauthenticatedError("Invaild Credentials");
  }

  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Password Updated" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUsers,
  updateUserPassword,
};

// updat user with findoneAndUpdate
// const updateUsers = async (req, res) => {
//   const { email, name } = req.body;
//   if (!email || !name) {
//     throw new CustomError.BadRequestError("Please provide all values");
//   }
//   const user = await User.findOneAndUpdate(
//     { _id: req.user.userId },
//     { email, name },
//     { new: true, runValidators: true }
//   );
//   const tokenUser = createTokenUser(user);
//   attatchCookiesResponse({res, user: tokenUser})
//   res.status(StatusCodes.OK).json({user: tokenUser})
// };
