import { Model, Column, Table, BelongsTo, PrimaryKey, AutoIncrement, ForeignKey } from "sequelize-typescript";
import CarModel from "./car.entity";
//models
import ClientModel from "./client.entity";

@Table({
    tableName: "orders",
    timestamps: false,
})
export default class OrderModel extends Model<OrderModel> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @ForeignKey(() => CarModel)
    @Column
    car_id: number;

    @BelongsTo(() => CarModel)
    carItem: CarModel;

    @ForeignKey(() => ClientModel)
    @Column
    client_id: number;

    @BelongsTo(() => ClientModel)
    clientItem: ClientModel;

    @Column
    date: Date;

    @Column
    amount: number;

    @Column
    price: number;
}
