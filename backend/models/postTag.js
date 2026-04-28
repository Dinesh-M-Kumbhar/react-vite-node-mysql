module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');

  return sequelize.define(
    'PostTag',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      tagId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      tableName: 'post_tags',
      timestamps: false,
      underscored: true
    }
  );
};