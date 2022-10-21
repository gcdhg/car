//lib
import moment = require("moment");
import * as sequelize from "sequelize";
//model
import CarModel from "../../models/car.entity";
import OrderModel from "../../models/order.entity";
import ClientModel from "../../models/client.entity";
import { Order } from "sequelize";

export default class OrdersRepository {
    static async getTotal({ start, end }: { start: string; end: string }) {
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

        return total;
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
}
