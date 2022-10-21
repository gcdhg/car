import {
    Model,
    Column,
    Table,
    BelongsTo,
    BelongsToMany,
    Scopes,
    CreatedAt,
    UpdatedAt,
    PrimaryKey,
    AutoIncrement,
    ForeignKey,
    HasMany,
    HasOne,
} from "sequelize-typescript";

@Table({
    tableName: "car",
    timestamps: false,
})
export default class CarModel extends Model<CarModel> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    name: string;

    @Column
    price: number;
}
