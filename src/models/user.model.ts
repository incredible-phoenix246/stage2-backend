import {
  Table,
  Column,
  Model,
  Unique,
  DataType,
  CreatedAt,
  BelongsToMany,
} from "sequelize-typescript";
import { Organisation } from "./organisation.model";
import { UserOrganisation } from "./userOrganisation.model";
import { IUser } from "../types";

@Table({ tableName: "users", timestamps: false })
export class User extends Model<User> implements IUser {
  @Unique
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  userId: string;

  @Column({ type: DataType.STRING, allowNull: false, field: "first_name" })
  firstName: string;

  @Column({ type: DataType.STRING, allowNull: false, field: "last_name" })
  lastName: string;

  @Unique
  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column
  phone!: string;

  @CreatedAt
  createdAt: Date;

  @BelongsToMany(() => Organisation, () => UserOrganisation)
  organisations: Organisation[];
}
