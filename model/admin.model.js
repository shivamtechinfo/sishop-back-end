const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["superadmin", "admin", "manager"],
      default: 'admin',
    },
    status: {
        type: Boolean,
        default: true,
    },
  },
  {
    timestamps: true,
  }
);


const adminModel = mongoose.model("Admin", AdminSchema)
module.exports = adminModel