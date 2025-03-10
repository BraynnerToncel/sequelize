import { Router } from 'express';
import { Post, User } from '../db/schema';
import { ValidationError } from 'sequelize';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    return void res.json(users);
  } catch (error) {
    console.log(error);
    return void res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return void res.status(404).json({ message: "User not found" });
    }

    const userWithPosts = await Post.findAll({
      where: { userId: user.id },
    });
 
    return void res.json(userWithPosts);
  } catch (error) {
    console.log(error);
    return void res.status(500).json({ message: "Internal server error" });
  }
});

router.post('/', async (req, res) => {
  try {
    const { email, name } = req.body;
    const Newuser = await User.create({email, name});
    return void res.status(201).json(Newuser);
      } catch (error) {
    console.log(error);
    if (error instanceof ValidationError) {
      return void res.status(400).json({ message: error.message });
    }
    return void res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
