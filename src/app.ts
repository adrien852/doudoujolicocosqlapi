import * as express from "express"
import { Request, Response } from "express"
import { Product } from "./entity/product.entity"
import { myDataSource } from "./app-data-source"

// establish database connection
myDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

// create and setup express app
const app = express()
app.use(express.json())

// register routes
app.get("/products", async function (req: Request, res: Response) {
    const products = await myDataSource.getRepository(Product).find()
    res.json(products)
})

app.get("/products/:id", async function (req: Request, res: Response) {
    const results = await myDataSource.getRepository(Product).findOneBy({
        id: Number(req.params.id),
    })
    return res.send(results)
})

app.post("/products", async function (req: Request, res: Response) {
    const product = await myDataSource.getRepository(Product).create(req.body)
    const results = await myDataSource.getRepository(Product).save(product)
    return res.send(results)
})

app.put("/products/:id", async function (req: Request, res: Response) {
    const product = await myDataSource.getRepository(Product).findOneBy({
        id: Number(req.params.id),
    })
    myDataSource.getRepository(Product).merge(product, req.body)
    const results = await myDataSource.getRepository(Product).save(product)
    return res.send(results)
})

app.delete("/products/:id", async function (req: Request, res: Response) {
    const results = await myDataSource.getRepository(Product).delete(req.params.id)
    return res.send(results)
})

// start express server
app.listen(3000)