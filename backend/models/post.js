module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');

  return sequelize.define(
    'Post',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      type: {
        type: DataTypes.ENUM('blog', 'video'),
        allowNull: false,
        defaultValue: 'blog'
      },
      status: {
        type: DataTypes.ENUM('draft', 'published'),
        allowNull: false,
        defaultValue: 'published'
      },
      publishedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      tableName: 'posts',
      timestamps: true,
      underscored: true
    }
  );
};