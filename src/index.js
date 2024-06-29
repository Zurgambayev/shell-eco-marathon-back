import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { regisrtateValidator, loginValidator, postCreatValidator } from './validation.js';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/userController.js';
import * as postController from './controllers/postController.js';
import handleValidationErrors from './utils/handleValidationErrors.js';
import cors from 'cors';
import fs from 'fs';

mongoose
  .connect(
    'mongodb+srv://erasylzurgambaev:erazenazuziko@cluster0.lctwdii.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0'
  )
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB err', err));

const app = express();

app.use(cors());
app.use(express.json()); // Позволяет читать JSON файлы

// Получение пути текущего модуля и преобразование его в путь к директории
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Проверьте и создайте директорию 'uploads', если она не существует
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use('/uploads', express.static('uploads')); // Сервер статических файлов

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    res.json({
      url: `/uploads/${req.file.originalname}`,
    });
  } catch (err) {
    console.error('File upload error:', err);
    res.status(500).json({ message: 'File upload failed' });
  }
});

app.post('/auth/login', loginValidator, handleValidationErrors, UserController.login);
app.post('/auth/register', regisrtateValidator, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.get('/posts', postController.getAll);
app.get('/posts/:id', postController.getOne);
app.post('/posts', checkAuth, postCreatValidator, handleValidationErrors, postController.create);
app.delete('/posts/:id', checkAuth, postController.remove);
app.patch('/posts/:id', checkAuth, postCreatValidator, handleValidationErrors, postController.update);

app.listen(3050, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server running on port 3050");
});



// import express from 'express';
// import multer from 'multer';
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcrypt';
// import mongoose from 'mongoose';
// import { fileURLToPath } from 'url';
// import path from 'path';
// import fs from 'fs';
// import { regisrtateValidator, loginValidator, postCreatValidator } from './validation.js';
// import { validationResult } from 'express-validator';
// import passwordHash from "./models/User.js";
// import UserModel from './models/User.js';
// import { message } from 'antd';
// import checkAuth from './utils/checkAuth.js';
// import * as UserController from './controllers/userController.js';
// import * as postController from './controllers/postController.js';

// mongoose
//   .connect(
//     'mongodb+srv://erasylzurgambaev:erazenazuziko@cluster0.lctwdii.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0'
//   )
//   .then(() => console.log('DB ok'))
//   .catch((err) => console.log('DB err', err));

// const app = express();

// app.get('/', (req, res) => {
//   res.send("hello1");
// });

// // Получение пути к текущему файлу и директории
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Создайте директорию 'uploads', если она не существует
// const uploadDir = path.join(__dirname, 'uploads');

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// const storage = multer.diskStorage({
//   destination: (_ , __  , cb ) => {
//     cb(null, 'uploads');
//   },
//   filename: (_, file, cb) => {
//     cb(null, file.originalname);
//   }
// });

// const upload = multer({ storage });

// app.use(express.json()); // Позволяет читать JSON файлы
// app.use('/uploads', express.static('uploads')); // Сервер статических файлов

// app.post('/upload', checkAuth, upload.single('image'), (req, res, next) => {
//   if (!req.file) {
//     const error = new Error('Please upload a file');
//     error.status = 400;
//     return next(error);
//   }

//   res.json({
//     url: `/uploads/${req.file.originalname}`,
//   });
// });

// app.post('/auth/login', loginValidator, UserController.login);
// app.post('/auth/register', regisrtateValidator, UserController.register);
// app.get('/auth/me', checkAuth, UserController.getMe);

// app.get('/posts', postController.getAll);
// app.get('/posts/:id', postController.getOne);
// app.post('/posts', checkAuth, postCreatValidator, postController.create);
// app.delete('/posts/:id', checkAuth, postController.remove);
// app.patch('/posts/:id', checkAuth, postController.update);

// // Обработчик ошибок должен быть добавлен после всех маршрутов
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(err.status || 500).json({
//     message: 'Internal Server Error',
//     error: err.message,
//   });
// });

// app.listen(3000, (err) => {
//   if (err) {
//     return console.log(err);
//   }
//   console.log("ook");
// });
