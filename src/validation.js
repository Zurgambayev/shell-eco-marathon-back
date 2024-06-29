import { body } from 'express-validator'

export const regisrtateValidator = [
    body('email', "неверный формат почты").isEmail(),
    body('password', "пороль должен быть минемум 5 символов ").isLength({min : 5}),
    body('fullName',"имя должен быть минемум 5 символов ").isLength({min : 3}),
    body('avatarUrl', "url не правельный ").optional().isURL(),
]
export const loginValidator = [
    body('email', "неверный формат почты").isEmail(),
    body('password', "пороль должен быть минемум 5 символов ").isLength({min : 5}),
]

export  const postCreatValidator = [
    body('title','Введите заголовок статьи').isLength({ min: 3 }).isString(),
    body('text','Введите текст статьи').isLength({ min: 3 }).isString(),
    body('tags','Неверный формат тагов (укажите массив)').optional().isString(),
    body('imageUrl','Неверная ссылка на изображение').optional().isString(),
]
// export default regisrtateValidator;
