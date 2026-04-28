const bcrypt = require('bcryptjs');
const { User, Post, Media, Comment, Tag } = require('./models');

const DEFAULT_ADMIN = {
  name: 'Admin User',
  email: 'admin@admin.com',
  password: 'Admin123!'
};

const DEFAULT_USER = {
  name: 'Demo User',
  email: 'demo@demo.com',
  password: 'Password123!'
};

module.exports = async function seed() {
  let admin = await User.findOne({ where: { email: DEFAULT_ADMIN.email } });
  if (!admin) {
    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
    admin = await User.create({
      name: DEFAULT_ADMIN.name,
      email: DEFAULT_ADMIN.email,
      password: hashedPassword,
      isAdmin: true
    });
    console.log('Created default admin:', DEFAULT_ADMIN.email);
  } else {
    console.log('Default admin already exists.');
  }

  let user = await User.findOne({ where: { email: DEFAULT_USER.email } });
  if (!user) {
    const hashedPassword = await bcrypt.hash(DEFAULT_USER.password, 10);
    user = await User.create({ name: DEFAULT_USER.name, email: DEFAULT_USER.email, password: hashedPassword });
    console.log('Created default user:', DEFAULT_USER.email);
  } else {
    console.log('Default user already exists.');
  }

  const existingPost = await Post.findOne({ where: { title: 'Welcome to the Feed' } });
  if (!existingPost) {
    const post = await Post.create({
      title: 'Welcome to the Feed',
      content: 'Share your thoughts, poems, stories, or video posts with the community. This app supports both blog and video content with comments.',
      type: 'blog',
      status: 'published',
      publishedAt: new Date(),
      authorId: admin.id
    });

    const tag = await Tag.findOrCreate({ where: { name: 'welcome' } });
    await post.addTag(tag[0]);

    await Comment.create({
      content: 'Great starter post! Looking forward to more content.',
      postId: post.id,
      authorId: user.id
    });

    console.log('Created sample blog post.');
  }

  const existingVideo = await Post.findOne({ where: { title: 'Video Story: Sunrise Thoughts' } });
  if (!existingVideo) {
    const post = await Post.create({
      title: 'Video Story: Sunrise Thoughts',
      content: 'A short video post with a link to a sunrise reflection. Feel free to replace this URL with your own clip.',
      type: 'video',
      status: 'published',
      publishedAt: new Date(),
      authorId: user.id
    });

    await Media.create({
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      type: 'video',
      label: 'Sample video',
      postId: post.id
    });

    const tag = await Tag.findOrCreate({ where: { name: 'video' } });
    await post.addTag(tag[0]);

    console.log('Created sample video post.');
  }
};
