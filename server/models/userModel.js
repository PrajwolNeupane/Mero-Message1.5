import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email:{
      type:String,
      required:true
    },
    password: {
      type: String,
      required: true,
    },
    image:{
      type:String,
      required:true
    },
    gender:{
      type:String,
      required:true
    }
  },
);

const UserModel = mongoose.model("Users", UserSchema);
export default UserModel;
