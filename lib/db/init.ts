//lib
import { Dialect } from "sequelize";
import { Sequelize } from "sequelize-typescript";
//models
import CarModel from "../models/car.entity";
import OrderModel from "../models/order.entity";
import ClientModel from "../models/client.entity";

const sequelize = (config: Record<string, string>) =>
    new Sequelize({
        database: config.database,
        dialect: <Dialect>config.dialect,
        username: config.username,
        password: config.password,
        storage: config.storage,
        host: config.host,
        port: parseInt(config.port) || 5432,
        models: [OrderModel, ClientModel, CarModel], // or [Player, Team],
    });

export default sequelize;
