import { Router } from "express";
import { Post } from "../db/schema";
import { ValidationError } from "sequelize";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll();
    return void res.json(posts);
  } catch (error) {
    console.log(error);
    return void res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;
    
    const newPost = await Post.create({ title, content, userId });
    return void res.status(201).json(newPost);
  } catch (error) {
    if (error instanceof ValidationError) {
      return void res.status(400).json({ 
        message: "Validation Error",
        errors: error.errors.map((err) => err.message),
      });
    }
    if(error instanceof Error &&
      error.name === "SequelizeForeignKeyConstraintError"){
      return void res.status(400).json({ message: 'User not found' });
    }
    return void res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    
    const post = await Post.findByPk(id);
    
    if (!post) {
      return void res.status(404).json({ message: 'Post not found' });
    }
    
    if (post.userId !== req.user.id) {
      return void res.status(403).json({ message: 'No tienes permiso para editar este post' });
    }
    
    post.title = title;
    post.content = content;
    await post.save();
    
    return void res.json(post);
  } catch (error) {
    console.log(error);
    return void res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await Post.findByPk(id);
    
    if (!post) {
      return void res.status(404).json({ message: 'Post not found' });
    }
    
    if (post.userId !== req.user.id) {
      return void res.status(403).json({ message: 'No tienes permiso para eliminar este post' });
    }
    
    await post.destroy();
    
    return void res.json({ message: 'Post eliminado correctamente' });
  } catch (error) {
    console.log(error);
    return void res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;