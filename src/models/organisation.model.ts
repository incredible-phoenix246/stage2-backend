import {
  Table,
  Column,
  Model,
  Unique,
  DataType,
  CreatedAt,
  BelongsToMany,
} from "sequelize-typescript";
import { User } from "./user.model";
import { UserOrganisation } from "./userOrganisation.model";
import { IOrganisation } from "../types";

@Table({ tableName: "organisations", timestamps: false })
export class Organisation extends Model<Organisation> implements IOrganisation {
  @Unique
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  orgId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @CreatedAt
  createdAt: Date;

  @BelongsToMany(() => User, () => UserOrganisation)
  users: User[];
}
