import { Table, Column, Model, DataType, HasOne, HasMany, PrimaryKey } from 'sequelize-typescript';
import role_tbl from './role_tbl';
import user_location from './user_location_tbl';

@Table({
  tableName: 'user_tbl',
  freezeTableName: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
export default class user_tbl extends Model {
    @PrimaryKey
    @Column({
        defaultValue: DataType.UUIDV4,
        type: DataType.UUID,
    })
    id!: string;
        
    @Column({
        type: DataType.STRING
    })
    email!:string;
    
    @Column({
        type: DataType.STRING
    })
    password!:string;
    
    @Column({
        type: DataType.BOOLEAN
    })
    is_active!:boolean;
    
    @Column({
        type: DataType.STRING
    })
    first_name!:string;

    @Column({
        type: DataType.STRING
    })
    last_name!:string;

    @Column({
        type: DataType.BOOLEAN
    })
    is_new!: boolean;

    @Column({
        type: DataType.BOOLEAN
    })
    is_reset!:boolean;

    @Column({
        type: DataType.BOOLEAN
    })
    is_lock!:boolean;

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

    @Column({
        type: DataType.STRING
    })
    role_id!: string;

    @HasOne(() => role_tbl, {
        foreignKey: 'id',
        sourceKey: 'role_id'
    })
    role!: role_tbl

    @HasMany(() => user_location, {
        foreignKey: 'user_id',
        sourceKey: 'id'
    })
    locations!: user_location[]
    
}
