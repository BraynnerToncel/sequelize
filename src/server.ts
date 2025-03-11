import express from 'express'; 
import { sequelize } from './db/sequelize'; 
import postRouter from "./routes/post.route"; 
import userRouter from "./routes/user.route";
import authRouter from "./routes/auth.route";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

// Rutas de autenticación
app.use("/api/v1/auth", authRouter);

// Rutas protegidas
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

const main = async () => {
  try {
    await sequelize.sync({alter:true});
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log('error :>> ', error);
  }
};

main();