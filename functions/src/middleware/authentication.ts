const jwt = require('jsonwebtoken');
import { Request, Response } from "express"

const authenticationMiddleware = {
    generateAccessToken(email: string, password: string) {
        const token = jwt.sign(
            {
                email: email,
                password: password
            }, 
            process.env.JWT_TOKEN_SECRET, 
            { expiresIn: '10h' }
        )
        return token;
    },

    authenticateAdminToken(req: Request, res: Response, next) {
        const authHeader = req.headers['cookie']
        const token = authHeader && authHeader.split('=')[1]
      
        if (token == null) return res.sendStatus(401)
      
        jwt.verify(token, process.env.JWT_TOKEN_SECRET as string, (err: any, user: any) => {
      
          if (err) return res.sendStatus(403)
          if(user.email.toLowerCase() !== process.env.ADMIN_LOGIN) return res.sendStatus(403)
      
          next()
        })
    }
}

module.exports = authenticationMiddleware;