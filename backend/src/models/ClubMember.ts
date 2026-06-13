import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/database'
import { User } from './User'
import { Club } from './Club'

export class ClubMember extends Model {
  public id!: number
  public clubId!: number
  public userId!: number
  public joinedAt!: Date
}

ClubMember.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    clubId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Club,
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    joinedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'club_members',
    timestamps: true
  }
)

ClubMember.belongsTo(Club, { as: 'club', foreignKey: 'clubId' })
Club.hasMany(ClubMember, { foreignKey: 'clubId' })

ClubMember.belongsTo(User, { as: 'user', foreignKey: 'userId' })
User.hasMany(ClubMember, { foreignKey: 'userId' })
