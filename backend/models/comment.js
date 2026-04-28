module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');

  return sequelize.define(
    'Comment',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      tableName: 'comments',
      timestamps: true,
      underscored: true
    }
  );
};