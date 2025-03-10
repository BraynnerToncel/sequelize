import express from 'express';
import { sequelize } from './db/sequelize';
import postRouter from "./routes/post.route";
import userRouter from "./routes/user.route";


const app = express ();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/post", postRouter);


const main = async () =>{
  try{
    // await sequelize.sync({alter: false});
    await sequelize.sync();
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    })
  }catch (error) {
    console.log('error :>> ', error);
  }
}


main();
