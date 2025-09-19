import { DataTypes } from 'sequelize';
import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript';

@Table({
  tableName: 'location_tbl',
  freezeTableName: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
export default class location_tbl extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataTypes.UUIDV4
    })
    id!:string

    @Column
    loc_code!:string

    @Column
    loc_name!:string
  
    @Column
    is_active!:boolean

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