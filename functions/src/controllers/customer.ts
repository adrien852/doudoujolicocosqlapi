import { serviceDS } from "../myDataSource"
import { Customer } from "../entity/customer.entity"
import { Address } from "../entity/address.entity";
import { Request, Response } from "express"
import * as bcrypt from 'bcrypt';
const authenticationMiddleware = require('../middleware/authentication')

const customerController = {
  async saveCustomerInfo(data: any) {
    let myDataSource = await serviceDS;

    let shippingAddress = Object.assign( myDataSource.getRepository(Address).create({
      name: data.name,
      city: data.address.city,
      postalCode: data.address.postal_code,
      address1: data.address.line1,
      address2: data.address.line2,
      phone: data.phone,
    }));

    await myDataSource.getRepository(Address).save(shippingAddress);
    let customer = myDataSource.getRepository(Customer).create({
        email: data.email,
        shippingAddress: shippingAddress
    })

    const results = await myDataSource.getRepository(Customer).save(customer)
    return results;
  },

  async signIn(req: Request, res: Response) {
    let myDataSource = await serviceDS;
    const myEncryptPassword = await Encrypt.cryptPassword(req.body.payload.password);
    let customer = myDataSource.getRepository(Customer).create({
        password: myEncryptPassword,
        email: req.body.payload.email
    })
    const results = await myDataSource.getRepository(Customer).save(customer)
    return res.send(results)
  },
  
  async login(req: Request, res: Response) {
    let myDataSource = await serviceDS;
    const customer = await myDataSource.getRepository(Customer).findOne({
        where: {
            email: req.body.payload.email,
        }
    })
    if(customer){
      const isPasswordCorrect = await Encrypt.comparePassword(req.body.payload.password, customer.password);
      if(isPasswordCorrect){
        const token = authenticationMiddleware.generateAccessToken(req.body.payload.email, req.body.payload.password)
        const cookieOptions = process.env.NODE_ENV === 'production' ? {
          httpOnly: true,
          secure: true, 
          domain:"."+process.env.DOMAIN, 
          sameSite: true,
          maxAge: 1000 * 60 * 60 * 10
        } : {
          secure: false,
          sameSite: false
        };
        res.cookie("__session", token, cookieOptions)
        if(req.body.payload.email.toLowerCase() === process.env.ADMIN_LOGIN){
          res.status(200).send({
            isAdmin: true,
            message: "Admin logged in"
          });
        }
        else{
          res.status(200).send({
            isAdmin: false,
            message: "User logged in"
          });
        }
      }
      else{
        res.status(401).send({
          code: "password",
          message: "Wrong password"
        });
      }
    }
    else{
      res.status(401).send({
        code: "email",
        message: 'Email not found'
      });
    }
  }
};

const Encrypt = {
  cryptPassword: (password: string) =>
      bcrypt.genSalt(10)
      .then((salt => bcrypt.hash(password, salt)))
      .then(hash => hash),
  
      comparePassword: (password: string, hashPassword: string) =>
          bcrypt.compare(password, hashPassword)
          .then(resp => resp)
}

module.exports = customerController;
