import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const checkAuth = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, ''); // Изменено на req.headers

    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret123');
            req.userId = decoded._id;
            next();
        } catch (e) {
            return res.status(403).json({
                message: 'нет доступа'
            });
        }
    } else {
        return res.status(403).json({
            message: 'нет доступа'
        });
    }
};

export default checkAuth;


// export default(req,res,next) => {
//     const token = (req.headers.authorization || '').replace(/Bearer\s?/,'');
//     if(token){
//         try{
//             const decoded = jwt.verify(token,'secret123') 
//             req.userId = decoded._id;
            
//             // res.send("LL")
//             next()
//         }catch(e){
//             return res.status(403).json({
//                 message:"нет доступа "
//             })
//         }
//     }else{
//         return res.status(403).json({
//             message:"нет доступа "
//         })
//     }
// }

// utils/checkAuth.js
