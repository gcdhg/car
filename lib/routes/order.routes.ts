//common
import { Request, Response, Router } from "express";
//model
import CarModel from "../models/car.entity";
import OrderModel from "../models/order.entity";
import ClientModel from "../models/client.entity";
//lib
import moment = require("moment");
import { Op } from "sequelize";
//repository
import OrdersRepository from "../classes/repository/order.repository";

const orderRouter = Router();

orderRouter.get("/total", async (req: Request, res: Response) => {
    const query = req.query;
    if (!query) {
        res.status(401);
        return res.json({ message: "no data" });
    }

    let { start, end } = <Record<string, string>>query;
    if (!start) {
        res.status(401);
        return res.json({ message: "no data" });
    }

    const total = await OrdersRepository.getTotal({ start, end });

    return res.json({ total });
});

orderRouter.get("/", async (req, res) => {
    res.json({ order: await OrdersRepository.getHistory() });
});

orderRouter.post("/seed", async (req: Request, res: Response) => {
    await OrdersRepository.seedData();
    res.status(200);
    return res.json({ message: "OK" });
});

export default orderRouter;
