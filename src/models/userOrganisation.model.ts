import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import { User } from "./user.model";
import { Organisation } from "./organisation.model";
import { IUserOrganisation } from "../types";

@Table({ tableName: "user_organisations", timestamps: false })
export class UserOrganisation
  extends Model<UserOrganisation>
  implements IUserOrganisation
{
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  userId: string;

  @ForeignKey(() => Organisation)
  @Column({ type: DataType.UUID })
  orgId: string;
}
