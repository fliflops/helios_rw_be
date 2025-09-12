import { Table, Column, Model, DataType, PrimaryKey, Unique } from 'sequelize-typescript';

@Table({
  tableName: 'booking_request_dtl_tbl',
  freezeTableName: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
export default class booking_request_dtl_tbl extends Model {
    @PrimaryKey
    @Unique
    @Column({
       // defaultValue: DataType.UUIDV4,
        type: DataType.UUID,
        allowNull: false
    })
    id!:string
    
    @Column
    br_id!: string;
    
    @Column
    br_no!: string;
    
    @Column
    sku_code!:string;
    
    @Column
    planned_qty!: number;
    
    @Column
    uom!: string;
    
    @Column
    weight!: number;
    
    @Column
    weight_uom!: string;
    
    @Column
    cbm!:number;
    
    @Column
    cbm_uom!:string;

    @Column
    cost!:number;

    @Column
    class_of_stores!: string;
    
    @Column
    created_by!:string
    
    @Column
    updated_by!:string
    
    @Column
    deleted_by!:string
    
    @Column
    created_at!:Date
    
    @Column
    updated_at!:Date
    
    @Column
    deleted_at!:Date
}