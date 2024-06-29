import jwt from "jsonwebtoken";

// utils/checkAuth.js
const checkAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Извлечение токена из заголовка
    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret123');
            req.userId = decoded._id; // Измените userID на userId
            next();
        } catch (err) {
            return res.status(403).json({
                message: 'Нет доступа',
            });
        }
    } else {
        return res.status(403).json({
            message: 'Нет доступа',
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
