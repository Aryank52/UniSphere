import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/database'
import { User } from './User'
import { Achievement } from './Achievement'

export class UserAchievement extends Model {
  public id!: number
  public userId!: number
  public achievementId!: number
  public earnedAt!: Date
}

UserAchievement.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    achievementId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Achievement,
        key: 'id'
      }
    },
    earnedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'user_achievements',
    timestamps: true
  }
)

UserAchievement.belongsTo(User, { as: 'user', foreignKey: 'userId' })
User.hasMany(UserAchievement, { foreignKey: 'userId' })

UserAchievement.belongsTo(Achievement, { as: 'achievement', foreignKey: 'achievementId' })
Achievement.hasMany(UserAchievement, { foreignKey: 'achievementId' })
