import { describe, expect, test } from "@jest/globals";
import OrdersRepository from "../classes/repository/order.repository";
import sequelize from "../db/init";
const config = require("../../config");

describe("orders", () => {
    beforeAll(async () => {
        await sequelize(config);
        await OrdersRepository.seedData();
    });

    test("total revenue", async () => {
        const total: number = await OrdersRepository.getTotal({ start: "2022-07-02", end: "2022-07-02" });

        expect(total).toBe(13000000);
    });
});
