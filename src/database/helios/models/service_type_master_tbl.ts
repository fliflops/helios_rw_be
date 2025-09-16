import { Table, Column, Model, DataType, PrimaryKey, Unique } from 'sequelize-typescript';

@Table({
  tableName: 'service_type_master_tbl',
  freezeTableName: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export default class service_type_master_tbl extends Model {
    @Column({
      type: DataType.UUID,
      allowNull: false,
      primaryKey:true
    })
    id!:string

    @Column
    service_type!: string
    
    @Column
    service_type_desc!: string

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