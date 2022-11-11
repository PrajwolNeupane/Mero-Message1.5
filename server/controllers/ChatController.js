import ChatModel from "../models/chatModel.js";
import UserModel from "../models/userModel.js";

export const createChat = async (req, res) => {
  const newChat = new ChatModel({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    let result = await newChat.save();

    result = await ChatModel.findOne({ _id: result._id })
      .populate("members", "-password")
      .populate("latestMessage");
    result = await UserModel.populate(result, {
      path: "latestMessage.senderId",
      select: "username",
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const userChats = async (req, res) => {
  try {
    let chat = await ChatModel.find({
      members: { $elemMatch: { $eq: req.body.id } }
    }).populate("members", "-password").populate("latestMessage")
      .sort({ updatedAt: -1 })

    chat = await UserModel.populate(chat, {
      path: "latestMessage.senderId",
      select: "username",
    });

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const findChat = async (req, res) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat)
  } catch (error) {
    res.status(500).json(error)
  }
};