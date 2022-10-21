import { Model, Column, Table, PrimaryKey, AutoIncrement } from "sequelize-typescript";

@Table({
    tableName: "client",
    timestamps: false,
})
export default class ClientModel extends Model<ClientModel> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    name: string;

    @Column
    phone: number;
}
