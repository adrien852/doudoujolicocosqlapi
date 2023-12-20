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
        const token = req.cookies['__session']

        if (token == null) return res.sendStatus(401)
      
        jwt.verify(token, process.env.JWT_TOKEN_SECRET as string, (err: any, user: any) => {
      
          if (err) return res.status(403).json('Token unverified - '+token)
          if(user.email.toLowerCase() !== process.env.ADMIN_LOGIN) return res.status(403).json('Not admin token - '+token)
            
          next()
        })
    },

    loginCheck(req: Request, res: Response) {
        res.sendStatus(200)
    }
}

module.exports = authenticationMiddleware;