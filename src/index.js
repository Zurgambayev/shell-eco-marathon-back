import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { regisrtateValidator, loginValidator, postCreatValidator } from './validations.js';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/userController.js';
import * as postController from './controllers/postController.js';
import * as commentController from './controllers/commentController.js';
import handleValidationErrors from './utils/handleValidationErrors.js';
import cors from 'cors';
import fs from 'fs';

mongoose
  .connect('mongodb+srv://erasylzurgambaev:erazenazuziko@cluster0.lctwdii.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB err', err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });
app.use(express.json()); // Позволяет читать JSON файлы

app.use(cors());

app.use('/uploads', express.static('uploads')); // Сервер статических файлов   
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Проверьте и создайте директорию 'uploads', если она не существует
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
      url: `/uploads/${req.file.originalname}`,
    });
});

app.post('/auth/login', loginValidator, handleValidationErrors, UserController.login);
app.post('/auth/register', regisrtateValidator, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);
app.get('/tags', postController.getLastTags);
app.get('/posts/tags', postController.getLastTags);

app.get('/posts', postController.getAll);
app.get('/posts/:id', postController.getOne);
app.post('/posts', checkAuth, postCreatValidator, handleValidationErrors, postController.create);
app.delete('/posts/:id', checkAuth, postController.remove);
app.patch('/posts/:id', checkAuth, postCreatValidator, handleValidationErrors, postController.update);

// Маршруты для комментариев
app.post('/posts/:postId/comments', checkAuth, commentController.addComment);
app.get('/posts/:postId/comments', commentController.getComments);
app.delete('/comments/:commentId', checkAuth, commentController.removeComment);

app.listen(3050, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server running on port 3050");
});
