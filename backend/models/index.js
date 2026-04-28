const { Sequelize } = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      charset: 'utf8mb4'
    },
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  }
);

const User = require('./user')(sequelize);
const Post = require('./post')(sequelize);
const Comment = require('./comment')(sequelize);
const Media = require('./media')(sequelize);
const Tag = require('./tag')(sequelize);
const PostTag = require('./postTag')(sequelize);

User.hasMany(Post, { foreignKey: 'authorId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(Post, { foreignKey: 'postId' });
Comment.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
User.hasMany(Comment, { foreignKey: 'authorId', as: 'comments' });

Post.hasMany(Media, { foreignKey: 'postId', as: 'media', onDelete: 'CASCADE' });
Media.belongsTo(Post, { foreignKey: 'postId' });

Post.belongsToMany(Tag, { through: PostTag, foreignKey: 'postId', otherKey: 'tagId', as: 'tags' });
Tag.belongsToMany(Post, { through: PostTag, foreignKey: 'tagId', otherKey: 'postId', as: 'posts' });

module.exports = {
  sequelize,
  User,
  Post,
  Comment,
  Media,
  Tag,
  PostTag
};
