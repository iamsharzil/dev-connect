const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name ']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Please provide your password'],
      minlength: [8, 'Password should be greater than 8 characters'],
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please provide your confirm password'],
      validate: {
        validator: function(el) {
          return el === this.password;
        },
        message: 'Passwords are not same!'
      }
    },
    avatar: {
      type: String
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function(next) {
  //Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //Delete passwordConfirm field
  this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
