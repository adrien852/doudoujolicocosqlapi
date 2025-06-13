import { Request, Response } from "express"
import { serviceDS } from "../myDataSource"
import { Home } from "../entity/home.entity";

const homeController = {

    async getElements(req: Request, res: Response) {
        let myDataSource = await serviceDS;
        const homeElements = await myDataSource.getRepository(Home).find({
            relations: ["promo"],
            order: { id: "DESC" },
            take: 1
        })
        const home = homeElements[0] || null;

        // On ne garde que promo.id (ou null si pas de promo)
        if (home) {
            res.send({
                ...home,
                promo: {
                    id: home.promo ? home.promo.id : null
                }
            });
        } else {
            res.send(null);
        }
    },

    async update(req: Request, res: Response) {
        let myDataSource = await serviceDS;
        let homePayload = req.body.payload;
        const reqId = Number(req.params.id);

        const repo = myDataSource.getRepository(Home);
        let home = await repo.findOne({ where: { id: reqId }, relations: ["promo"] });
        if (!home) return res.status(404).send({ error: "Not found" });

        if ('promo' in homePayload) {
            if (homePayload.promo && homePayload.promo.id === null) {
                home.promo = null;
            }
        }

        Object.assign(home, homePayload);

        await repo.save(home);
        res.send({ success: true });
    }
}

module.exports = homeController;