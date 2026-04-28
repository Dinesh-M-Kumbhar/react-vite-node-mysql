module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');

  return sequelize.define(
    'Tag',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      }
    },
    {
      tableName: 'tags',
      timestamps: true,
      underscored: true
    }
  );
};