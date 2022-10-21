//lib
import moment = require("moment");
import * as sequelize from "sequelize";
//model
import CarModel from "../../models/car.entity";
import OrderModel from "../../models/order.entity";
import ClientModel from "../../models/client.entity";

export default class OrdersRepository {
    static async getTotal({ start, end }: { start: string; end: string }): Promise<number> {
        if (!start) return 0;

        if (!end) {
            end = moment().format();
        }

        const total = await OrderModel.sequelize.query(
            `SELECT sum(price * amount) AS total FROM orders where date between '${moment(start).startOf("D").format()}' and '${moment(end)
                .endOf("D")
                .format()}'`,
            { type: sequelize.QueryTypes.SELECT }
        );

        const [data] = <[{ total: string }]>total;

        return parseInt(data?.total) || 0;
    }

    static async getHistory() {
        const query = `SELECT orderItems.id,
        orderItems.date,
        orderItems.total,
        clientItem.name as clientName,
        clientItem.phone as clientPhone,
        carItem.name as carName
            FROM (
                SELECT id,
                    date,
                    client_id,
                    car_id,
                    SUM(price * amount) as total
                from orders ordersmodel
                GROUP BY ordersmodel.id
            ) orderItems
            JOIN client clientItem ON clientItem.id = orderItems.client_id
            JOIN car carItem ON carItem.id = orderItems.car_id
        ORDER BY orderItems.date desc, clientItem.name desc, orderItems.total desc`;

        const orders = await OrderModel.sequelize.query(query, { type: sequelize.QueryTypes.SELECT });

        return orders;
    }

    static async seedData() {
        await OrderModel.destroy({ where: { id: { [sequelize.Op.not]: null } } });
        await Promise.all([
            CarModel.destroy({ where: { id: { [sequelize.Op.not]: null } } }),
            ClientModel.destroy({ where: { id: { [sequelize.Op.not]: null } } }),
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
                3_500_000,
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
                1,
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
            dataOrder.map(
                (el) => <OrderModel>{ date: moment(el[0]).toDate(), car_id: el[1], client_id: el[2], amount: el[3], price: el[4] }
            )
        );
    }
}
