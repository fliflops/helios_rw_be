import { Table, Column, Model, DataType, ForeignKey, PrimaryKey, HasOne } from 'sequelize-typescript';
import user_tbl from './user_tbl';
import location_tbl from './location_tbl';

@Table({
  tableName: 'user_location_tbl',
  freezeTableName: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
export default class user_location_tbl extends Model {
  @PrimaryKey  
  @Column
    id!: string;
    
    @ForeignKey(() => user_tbl)
    @Column
    user_id!:string;

    @Column
    loc_code!: string

    @HasOne(() => location_tbl, {
        sourceKey: 'loc_code',
        foreignKey: 'loc_code'
    })
    location!: location_tbl

    @Column
    is_active!: boolean
    
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