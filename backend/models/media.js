module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');

  return sequelize.define(
    'Media',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM('video', 'attachment'),
        allowNull: false,
        defaultValue: 'video'
      },
      label: {
        type: DataTypes.STRING,
        allowNull: true
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      tableName: 'media',
      timestamps: true,
      underscored: true
    }
  );
};