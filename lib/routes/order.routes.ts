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
    await OrderModel.destroy({ where: { id: { [Op.not]: null } } });
    await Promise.all([
        CarModel.destroy({ where: { id: { [Op.not]: null } } }),
        ClientModel.destroy({ where: { id: { [Op.not]: null } } }),
    ]);

    const dataCar = [
        ["BMW X5", 2_000_000],
        ["BMW X6", 3_000_000],
        ["BMW X7", 2_000_000],
    ];

    const dataClient = [
        ["Иванов Сергей", "+79107891122"],
        ["Коробкин Олег", "+79107891155"],
        ["Олейкин Роман", "+79107891166"],
    ];

    await CarModel.bulkCreate(dataCar.map((el) => <CarModel>{ name: el[0], price: el[1] }));
    await ClientModel.bulkCreate(dataClient.map((el) => <any>{ name: el[0], phone: el[1] }));

    const cars = await CarModel.findAll();
    const clients = await ClientModel.findAll();

    const dataOrder = [
        [
            moment.utc("2022-07-01").startOf("D").format(),
            cars.find((el) => el.name === "BMW X5")?.id,
            clients.find((el) => el.name === "Иванов Сергей")?.id,
            1,
            2_000_000,
        ],
        [
            moment.utc("2022-07-02").startOf("D").format(),
            cars.find((el) => el.name === "BMW X6")?.id,
            clients.find((el) => el.name === "Коробкин Олег")?.id,
            2,
            3_500_000 ,
        ],
        [
            moment.utc("2022-07-02").startOf("D").format(),
            cars.find((el) => el.name === "BMW X7")?.id,
            clients.find((el) => el.name === "Олейкин Роман")?.id,
            1,
            2_000_000,
        ],
        [
            moment.utc("2022-07-02").startOf("D").format(),
            cars.find((el) => el.name === "BMW X7")?.id,
            clients.find((el) => el.name === "Коробкин Олег")?.id,
            1,
            2_000_000,
        ],
        [
            moment.utc("2022-07-02").startOf("D").format(),
            cars.find((el) => el.name === "BMW X5")?.id,
            clients.find((el) => el.name === "Коробкин Олег")?.id,
            2,
            2_000_000,
        ],
        [
            moment.utc("2022-07-03").startOf("D").format(),
            cars.find((el) => el.name === "BMW X6")?.id,
            clients.find((el) => el.name === "Иванов Сергей")?.id,
            1,
            3_000_000,
        ],
    ];

    OrderModel.bulkCreate(
        dataOrder.map((el) => <OrderModel>{ date: moment(el[0]).toDate(), car_id: el[1], client_id: el[2], amount: el[3], price: el[4] })
    );
});

export default orderRouter;
