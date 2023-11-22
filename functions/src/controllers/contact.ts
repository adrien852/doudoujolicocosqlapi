import { Request, Response } from "express"
import { serviceDS } from "../myDataSource"
const sendContactEmail = require('../email/templates/contact');

const emailController = {
    sendContact(req: Request, res: Response) {
        sendContactEmail(req.body.payload);
        return res.status(201).json(
            {
                email: "Sending email",
                order: req.body.payload
            }
        )
    }
}

module.exports = emailController;