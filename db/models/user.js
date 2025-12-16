'use strict';
const { Model, Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../../config/database');
const AppError = require('../../utils/appError');

module.exports = sequelize.define(
  'user',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    nik: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'NIK is required',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Invalid email format',
        },
        notNull: {
          msg: 'Email is required',
        },
      },
    },
    userType: {
      type: DataTypes.ENUM('0', '1', '2'),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'userType is required',
        },
        notEmpty: {
          msg: 'userType cannot be empty',
        },
        isIn: {
          args: [['0', '1', '2']],
          msg: 'Invalid userType',
        },
      },
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Username is required',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
    },
    confirmPassword: {
      type: DataTypes.VIRTUAL,
      set(value) {
        if (value !== this.password) {
          throw new AppError(
            'Password confirmation does not match password',
            400
          );
        }
        const hashPassword = bcrypt.hashSync(this.password, 10);
        this.setDataValue('password', hashPassword);
      },
    },
    status: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
    modelName: 'user',
  }
);
