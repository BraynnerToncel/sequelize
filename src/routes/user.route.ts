// routes/user.route.ts
import { Router } from 'express';
import { Post, User } from '../db/schema';
import { ValidationError } from 'sequelize';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'name'] // No incluir password
    });
    return void res.json(users);
  } catch (error) {
    console.log(error);
    return void res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ['id', 'email', 'name'] // No incluir password
    });

    if (!user) {
      return void res.status(404).json({ message: "User not found" });
    }

    const userPosts = await Post.findAll({
      where: { userId: user.id },
    });
 
    return void res.json({
      user,
      posts: userPosts
    });
  } catch (error) {
    console.log(error);
    return void res.status(500).json({ message: "Internal server error" });
  }
});

export default router;