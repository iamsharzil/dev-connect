const mongoose = require('mongoose');
// const slugify = require('slugify');

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    slug: String,
    company: {
      type: String
    },
    website: {
      type: String
    },
    location: {
      type: String
    },
    status: {
      type: String,
      required: [true, 'Status is required']
    },
    skills: {
      type: [String],
      required: [true, 'Skills is required']
    },
    bio: {
      type: String
    },
    githubusername: {
      type: String
    },
    experience: [
      {
        title: {
          type: String,
          required: [true, 'Experience is required']
        },
        company: {
          type: String,
          required: [true, 'Company is required']
        },
        location: {
          type: String
        },
        from: {
          type: Date,
          required: [true, 'From Date is required']
        },
        to: {
          type: Date
        },
        current: {
          type: Boolean,
          default: false
        },
        description: {
          type: String,
          trim: true
        }
      }
    ],
    education: [
      {
        school: {
          type: String,
          required: [true, 'Education is required']
        },
        degree: {
          type: String,
          required: [true, 'Degree is required']
        },
        fieldOfStudy: {
          type: String,
          required: [true, 'Field Of Study is required']
        },
        from: {
          type: Date,
          required: [true, 'From Date is required']
        },
        to: {
          type: Date
        },
        current: {
          type: Boolean,
          default: false
        },
        description: {
          type: String,
          trim: true
        }
      }
    ],
    social: {
      youtube: {
        type: String
      },
      twitter: {
        type: String
      },
      facebook: {
        type: String
      },
      linkedin: {
        type: String
      },
      instagram: {
        type: String
      }
    }
  },
  {
    timestamps: true
  }
);

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
