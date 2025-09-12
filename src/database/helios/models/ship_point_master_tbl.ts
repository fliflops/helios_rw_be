import { Table, Column, Model, DataType, HasOne, HasMany, PrimaryKey, Unique } from 'sequelize-typescript';

@Table({
    tableName: 'ship_point_master_tbl',
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})
export default class ship_point_master_tbl extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID
    })
    id!:string;

    @Unique
    @Column
    ship_point_code!:string;
    
    @Column
    ship_point_desc!:string;
    
    @Column
    ship_point_address!:string;
    
    @Column
    city!:string;
    
    @Column
    state!:string;
    
    @Column
    country!:string;
    
    @Column
    ship_pt_zone!:string;
    
    @Column
    postal_code!:string;
    
    @Column
    is_active!:boolean;
    
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