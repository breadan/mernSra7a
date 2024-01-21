import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minLength: 4,
      maxLength: 10
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
      match: [/.+@.+\..+/, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: true,
      min: [4, 'Password must be at least 4 characters'],
      max: [10, 'Password must be at least 10 characters']
    },
    age: {
      type: Number
    },
    profilePhoto: {
      type: Object,
      default: {
        url: 'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=2048x2048&w=is&k=20&c=6hQNACQQjktni8CxSS_QSPqJv2tycskYmpFGzxv3FNs=',
        publicId: null
      }
    },
    bio: {
      type: String
    },
    verified: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: 'Invalid role'
      },
      isAdmin: {
        type: Boolean,
        default: false
      },
      default: 'user'
    }
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  const user = this

  if (!user.isModified('password')) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = bcrypt.hashSync(user.password, salt)
    user.password = hashedPassword
    next()
  } catch (error) {
    next(error)
  }
})

// const generateAuthToken = (userSchema.methods.generateAuthToken = function () {   //testit
//   return jwt.sign(
//     { id: this._id, isAdmin: this.isAdmin },
//     process.env.JWT_SECRET,
//     {
//       expiresIn: process.env.JWT_EXPIRES_IN,
//     }
//   );
// });

export const userModel = model('User', userSchema)
