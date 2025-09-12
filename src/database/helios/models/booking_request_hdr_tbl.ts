import { Table, Column, Model, DataType, PrimaryKey, Unique } from 'sequelize-typescript';

@Table({
  tableName: 'booking_request_hdr_tbl',
  freezeTableName: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export default class booking_request_hdr_tbl extends Model {

    @Column({
      type: DataType.UUID,
      allowNull: false,
      primaryKey:true
    })
    id!:string

    @Column({
      primaryKey:true,
      allowNull:false
    })
    br_no!:string
    
    @Column
    service_type!:string
    
    @Column
    dr_no!:string
    
    @Column
    shipment_manifest!:string
    
    @Column
    principal!:string
    
    @Column
    ship_to_code!:string
    
    @Column
    invoice_no!:string
    
    @Column
    delivery_date!:string
    
    @Column
    br_status!:string
    
    @Column
    location_code!:string
    
    @Column
    reason_code!:string
    
    @Column
    delivery_status!:string
    
    @Column
    rud_status!:string
    
    @Column
    amount!:string
    
    @Column
    ship_from!:string
    
    @Column
    sub_service_type!:string
    
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

