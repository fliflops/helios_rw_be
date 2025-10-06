import { Table, Column, Model, DataType, PrimaryKey, BelongsTo } from 'sequelize-typescript';

@Table({
  tableName: 'role_access_tbl2',
  freezeTableName: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
export default class role_access_tbl2 extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    id!: string;
    
    @Column({
        type: DataType.UUID,
    })
    role_id!: string;

    @Column
    header_key!: string;

    @Column
    module_key!: string;

    @Column
    module_name!: string;
    
    @Column
    view!: boolean;
    
    @Column
    create!: boolean;

    @Column
    edit!: boolean;
    
    @Column
    export!: boolean;

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
        type: DataType.DATE,
        field: 'deleted_at',
    })
    deleted_at!: Date;

    @Column({
        type: DataType.STRING,
    })
    created_by!: string;

    @Column({
        type: DataType.STRING,
    })
    updated_by!: string;    

    @Column({
        type: DataType.STRING,
    })
    deleted_by!: string;    
}