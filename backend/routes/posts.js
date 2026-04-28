const express = require('express');
const { Post, User, Media, Comment, Tag } = require('../models');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const includePostDetails = [
  { model: User, as: 'author', attributes: ['id', 'email'] },
  { model: Media, as: 'media' },
  {
    model: Comment,
    as: 'comments',
    attributes: ['id']
  },
  { model: Tag, as: 'tags', attributes: ['id', 'name'] }
];

async function findOrCreateTags(tagNames = []) {
  const normalized = Array.isArray(tagNames)
    ? tagNames.map((name) => name.trim()).filter(Boolean)
    : [];

  const tags = [];
  for (const name of normalized) {
    const [tag] = await Tag.findOrCreate({ where: { name } });
    tags.push(tag);
  }
  return tags;
}

router.get('/', async (req, res) => {
  const posts = await Post.findAll({
    where: { status: 'published' },
    include: includePostDetails,
    order: [['published_at', 'DESC']]
  });

  return res.json({ posts });
});

router.get('/mine', authMiddleware, async (req, res) => {
  const posts = await Post.findAll({
    where: { authorId: req.user.id },
    include: includePostDetails,
    order: [['updated_at', 'DESC']]
  });

  return res.json({ posts });
});

router.get('/:id', async (req, res) => {
  const post = await Post.findByPk(req.params.id, {
    include: [
      { model: User, as: 'author', attributes: ['id', 'email'] },
      { model: Media, as: 'media' },
      {
        model: Comment,
        as: 'comments',
        include: [{ model: User, as: 'author', attributes: ['id', 'email'] }]
      },
      { model: Tag, as: 'tags', attributes: ['id', 'name'] }
    ],
    order: [[{ model: Comment, as: 'comments' }, 'created_at', 'ASC']]
  });

  if (!post) {
    return res.status(404).json({ message: 'Post not found.' });
  }

  return res.json({ post });
});

router.post('/', authMiddleware, async (req, res) => {
  const { title, content, type, status, publishedAt, media, tags } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Post title is required.' });
  }

  const draftStatus = status === 'draft' ? 'draft' : 'published';
  const record = await Post.create({
    title,
    content,
    type: type === 'video' ? 'video' : 'blog',
    status: draftStatus,
    publishedAt: draftStatus === 'published' ? publishedAt || new Date() : null,
    authorId: req.user.id
  });

  if (media && Array.isArray(media)) {
    await Promise.all(
      media
        .filter((item) => item && item.url)
        .map((item) => Media.create({
          url: item.url,
          type: item.type || 'video',
          label: item.label || null,
          postId: record.id
        }))
    );
  }

  if (tags && Array.isArray(tags)) {
    const tagRecords = await findOrCreateTags(tags);
    await record.addTags(tagRecords);
  }

  const createdPost = await Post.findByPk(record.id, { include: includePostDetails });
  return res.status(201).json({ post: createdPost });
});

router.put('/:id', authMiddleware, async (req, res) => {
  const { title, content, type, status, publishedAt, media, tags } = req.body;
  const post = await Post.findByPk(req.params.id, { include: [Tag, Media] });

  if (!post) {
    return res.status(404).json({ message: 'Post not found.' });
  }

  if (post.authorId !== req.user.id && !req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied.' });
  }

  await post.update({
    title: title ?? post.title,
    content: content ?? post.content,
    type: type === 'video' ? 'video' : 'blog',
    status: status === 'draft' ? 'draft' : 'published',
    publishedAt: status === 'published' ? publishedAt || post.publishedAt || new Date() : null
  });

  if (Array.isArray(media)) {
    await Media.destroy({ where: { postId: post.id } });
    await Promise.all(
      media
        .filter((item) => item && item.url)
        .map((item) => Media.create({
          url: item.url,
          type: item.type || 'video',
          label: item.label || null,
          postId: post.id
        }))
    );
  }

  if (Array.isArray(tags)) {
    const tagRecords = await findOrCreateTags(tags);
    await post.setTags(tagRecords);
  }

  const updatedPost = await Post.findByPk(post.id, { include: includePostDetails });
  return res.json({ post: updatedPost });
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (!post) {
    return res.status(404).json({ message: 'Post not found.' });
  }

  if (post.authorId !== req.user.id && !req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied.' });
  }

  await post.destroy();
  return res.json({ message: 'Post deleted.' });
});

module.exports = router;
