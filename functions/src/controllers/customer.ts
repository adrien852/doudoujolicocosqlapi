import { myDataSource } from "../myDataSource"
import { Customer } from "../entity/customer.entity"
import { Address } from "../entity/address.entity";
import { Request, Response } from "express"
import * as bcrypt from 'bcrypt';
const CryptoJS = require("crypto-js");
const secretKey = process.env.SECRET_KEY;
const authenticationMiddleware = require('../middleware/authentication')

function validateHmac(secretKey, receivedPayload){
    return CryptoJS.enc.Hex.stringify(CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey).update(receivedPayload).finalize());
  }

const customerController = {
  // all(req, res) {
  //   Product.find()
  //     .sort({ _id: -1 })
  //     .populate('category')
  //     .exec((err, products) => res.json(products)
  //     )
  // },
  async save(req: Request, res: Response) {
    
    const serverHmac = validateHmac(secretKey, req.body.payload);
    if(serverHmac == req.body.hmac){
        let shippingAddress = Object.assign( myDataSource.getRepository(Address).create({...req.body.payload.shippingAddress}));
        await myDataSource.getRepository(Address).save(shippingAddress);
        let billingAddress = null
        if(req.body.payload.isSameAsShipping){
            billingAddress = shippingAddress;
        }
        else{
            billingAddress = Object.assign( myDataSource.getRepository(Address).create({...req.body.payload.billingAddress}));
            await myDataSource.getRepository(Address).save(billingAddress);
        }
        let customer = myDataSource.getRepository(Customer).create({
            id: req.body.payload.id,
            email: req.body.payload.email,
            shippingAddress: shippingAddress,
            billingAddress: billingAddress
        })
        const results = await myDataSource.getRepository(Customer).save(customer)
        return res.send(results)
    }
    else{
        res.status(500).send('Wrong HMAC');
    }
  },

  async signIn(req: Request, res: Response) {
    
    const myEncryptPassword = await Encrypt.cryptPassword(req.body.payload.password);
    let customer = myDataSource.getRepository(Customer).create({
        password: myEncryptPassword,
        email: req.body.payload.email
    })
    const results = await myDataSource.getRepository(Customer).save(customer)
    return res.send(results)
  },
  
  async login(req: Request, res: Response) {
    
    const customer = await myDataSource.getRepository(Customer).findOne({
        where: {
            email: req.body.payload.email,
        }
    })
    if(customer){
      const isPasswordCorrect = await Encrypt.comparePassword(req.body.payload.password, customer.password);
      if(isPasswordCorrect){
        const token = authenticationMiddleware.generateAccessToken(req.body.payload.email, req.body.payload.password)
        res.cookie("token", token, {httpOnly: true, sameSite: "none", secure:true})
        res.sendStatus(200)
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
