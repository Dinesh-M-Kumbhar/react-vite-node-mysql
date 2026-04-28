const express = require('express');
const { Comment, Post, User } = require('../models');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/post/:postId', async (req, res) => {
  const post = await Post.findByPk(req.params.postId);
  if (!post) {
    return res.status(404).json({ message: 'Post not found.' });
  }

  const comments = await Comment.findAll({
    where: { postId: req.params.postId },
    include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email'] }],
    order: [['created_at', 'ASC']]
  });

  return res.json({ comments });
});

router.post('/', authMiddleware, async (req, res) => {
  const { postId, content } = req.body;

  if (!postId || !content) {
    return res.status(400).json({ message: 'Post ID and comment content are required.' });
  }

  const post = await Post.findByPk(postId);
  if (!post) {
    return res.status(404).json({ message: 'Post not found.' });
  }

  const comment = await Comment.create({
    content,
    postId,
    authorId: req.user.id
  });

  const result = await Comment.findByPk(comment.id, {
    include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email'] }]
  });

  return res.status(201).json({ comment: result });
});

router.put('/:id', authMiddleware, async (req, res) => {
  const comment = await Comment.findByPk(req.params.id);
  if (!comment) {
    return res.status(404).json({ message: 'Comment not found.' });
  }

  if (comment.authorId !== req.user.id && !req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied.' });
  }

  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: 'Comment content is required.' });
  }

  await comment.update({ content });
  return res.json({ comment });
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const comment = await Comment.findByPk(req.params.id);
  if (!comment) {
    return res.status(404).json({ message: 'Comment not found.' });
  }

  if (comment.authorId !== req.user.id && !req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied.' });
  }

  await comment.destroy();
  return res.json({ message: 'Comment deleted.' });
});

module.exports = router;
