import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/database'
import { User } from './User'

export class Notification extends Model {
  public id!: number
  public userId!: number
  public title!: string
  public message!: string
  public type!: 'ALERT' | 'EVENT_APPROVAL' | 'REGISTRATION'
  public isRead!: boolean
}

Notification.init(
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
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('ALERT', 'EVENT_APPROVAL', 'REGISTRATION'),
      allowNull: false,
      defaultValue: 'ALERT'
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    tableName: 'notifications',
    timestamps: true
  }
)

Notification.belongsTo(User, { as: 'user', foreignKey: 'userId' })
User.hasMany(Notification, { foreignKey: 'userId' })
