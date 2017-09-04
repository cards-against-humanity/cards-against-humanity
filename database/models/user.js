const db = require('../connection');
const Sequelize = require('sequelize');
const maxThemeId = 4; // Defines number of client-side themes that exist

const UserModel = db.define('users', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  googleId: {
    type: Sequelize.STRING,
    unique: true
  },
  firstname: {
    type: Sequelize.STRING,
    notEmpty: true,
    allowNull: false
  },
  lastname: {
    type: Sequelize.STRING,
    notEmpty: true,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING
  },
  themeId: {
    type: Sequelize.INTEGER(2),
    defaultValue: 1
  }
});

let User = {model: UserModel};

// Accepts a user's email and returns the
// user stored in the database
//
// Exceptions:
// 1. userEmail does not map to any existing users
User.getByEmail = (userEmail) => {
  return User.model.findOne({
    where: {
      email: userEmail
    },
    attributes: {
      exclude: ['password']
    }
  })
    .then((user) => {
      if (!user) {
        return Promise.reject('No user is registered under ' + userEmail);
      }
      return user;
    });
};

User.changeTheme = (userId, themeId) => {
  if (!themeId || themeId.constructor !== Number || themeId < 0 || themeId > maxThemeId) {
    return Promise.reject('Theme ID must be a number between zero and ' + maxThemeId);
  }
  return User.getById(userId)
    .then((user) => {
      return user.update({themeId});
    });
};

// TODO - Purge password here
User.getById = (userId) => {
  return User.model.findById(userId)
    .then((user) => {
      return user ? user : Promise.reject('User does not exist');
    });
};

module.exports = User;