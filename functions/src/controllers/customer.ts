import { serviceDS } from "../myDataSource"
import { Customer } from "../entity/customer.entity"
import { Address } from "../entity/address.entity";
import { Request, Response } from "express"
const CryptoJS = require("crypto-js");
const secretKey = process.env.SECRET_KEY;


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
    let myDataSource = await serviceDS;
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
  }
};

module.exports = customerController;
