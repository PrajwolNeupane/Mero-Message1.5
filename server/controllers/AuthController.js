import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register new user
export const registerUser = async (req, res) => {

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashedPass
  const newUser = new UserModel(req.body);

  try {
    // addition new
    const oldUser = await UserModel.findOne({ email:req.body.email });

    if (oldUser)
      return res.status(400).json({ message: "User already exists" });

    // changed
    const user = await newUser.save();
    const token = jwt.sign(
      { id: user._id },
      "1234567890",
    );
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User

// Changed
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (user) {
      const validity = await bcrypt.compare(password, user.password);

      if (!validity) {
        res.status(400).json({message:"Password wrong"});
      } else {
        const token = jwt.sign(
          { id: user._id },
          "1234567890"
        );
        res.status(200).json({ token });
      }
    } else {
      res.status(404).json({message:"User not found"});
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
