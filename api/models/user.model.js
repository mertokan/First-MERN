import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      //   validate: {
      //     validator: validator.isEmail,
      //     message: 'Please provide a valid email',
      //   },
      unique: true,
    },
    password: {
      type: String,
      required: true,
      // minlength: 6,
      select: false,
    },
  },
  {
    timestamps: true,
  }
)
const User = mongoose.model('User', userSchema)

export default User
