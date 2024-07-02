
import  jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import UserModel from '../models/User.js'

export const register = async (req,res) =>{
    try{
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await  bcrypt.hash(password,salt);
    
        const doc = new UserModel({
            email:req.body.email,
            fullName: req.body.fullName,
            avatarUrl:req.body.avatarUrl,
            passwordHash: hash,
        });
        const user = await doc.save()

        const token = jwt.sign(
            {
                _id:user._id
            },
            'secret123',
            {
                expiresIn:'30d'
            },
        )
        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...user._doc,
            token,
        })
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:'не удалось зарегаться'
        })
    }
}

export const login = async(req,res) => {
    try{
        const user = await UserModel.findOne({email: req.body.email})
        if(!user){
            return res .status(404).json({
                message:"пользователь не найден",
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if(!isValidPass){
            return res.status(404).json({
                message:"неверный логин либо пороль ",
            })
        }
        const token = jwt.sign(
            {
                _id:user._id
            },
            'secret123',
            {
                expiresIn:'30d'
            },
        )
        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...userData,
            token,
        }) 
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:'не удалось авторизоваться '
        })
    }
}

export const getMe = async (req, res) => {
    try {
        console.log("User ID from request:", req.userId); // Лог для проверки userId
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "пользователь не нашелся",
            });
        }

        const { passwordHash, ...userData } = user._doc;
        // console.log("User data to return:", userData); // Лог для проверки userData
        res.json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'нет доступа',
        });
    }
};

