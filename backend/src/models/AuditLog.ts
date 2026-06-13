import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/database'
import { User } from './User'

export class AuditLog extends Model {
  public id!: number
  public userId!: number | null
  public action!: string
  public ipAddress!: string | null
  public details!: string | null
}

AuditLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: 'id'
      }
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'audit_logs',
    timestamps: true
  }
)

AuditLog.belongsTo(User, { as: 'user', foreignKey: 'userId' })
User.hasMany(AuditLog, { foreignKey: 'userId' })
