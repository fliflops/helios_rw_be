import { Table, Column, Model, DataType, HasOne, HasMany, PrimaryKey, Unique } from 'sequelize-typescript';

@Table({
    tableName: 'customer_master_tbl',
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})
export default class customer_master_tbl extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID
    })
    id!:string;

    @Column
    customer_code!:string

    @Column
    customer_name!:string
    @Column
    is_active!:boolean
    @Column
    customer_address!:string
    @Column
    customer_desc!:string
    
    @Column({
        type: DataType.DATE,
        field: 'created_at',
    })
    created_at!: Date;

    @Column({
        type: DataType.DATE,
        field: 'updated_at',
    })
    updated_at!: Date;

    @Column({
        type: DataType.STRING,
    })
    created_by!: string;

    @Column({
        type: DataType.STRING,
    })
    updated_by!: string;
}