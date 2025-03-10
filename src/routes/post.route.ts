import { Router } from "express";
import { Post } from "../db/schema";
import { ValidationError } from "sequelize";


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



router.post('/', async (req, res) => {
  try {
    const { title, content, userId } = req.body;
    const newPost = await Post.create({ title, content, userId});
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
    return void res.status(400).json({ message: 'User nor found' });

    }
    return void res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;