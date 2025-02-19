import { sequelize, DataTypes } from "./db";

const TagModel = sequelize.define("tags", {
  ownerId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  walletId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tag: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default TagModel;
