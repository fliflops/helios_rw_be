import { Table, Column, Model, DataType, PrimaryKey, BelongsTo, HasMany } from 'sequelize-typescript';
import user_tbl from './user_tbl';
import role_access_tbl2 from './role_access_tbl2';

@Table({
  tableName: 'role_tbl',
  freezeTableName: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
export default class role_tbl extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    id!: string;
    
    @Column
    role_name!:string;

    @Column
    is_active!:boolean;

    @Column
    is_admin!:boolean;

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

    @HasMany(() => role_access_tbl2, {
        foreignKey: 'role_id',
        sourceKey: 'id'
    })
    modules!: role_access_tbl2[]
}