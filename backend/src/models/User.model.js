const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    department: {
      type: String,
      required: true,
      trim: true
    },
    year: {
      type: String,
      required: true,
      enum: [
        "1st year",
        "2nd year",
        "3rd year",
        "4th year",
        "5th year",
        "Graduate"
      ]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
