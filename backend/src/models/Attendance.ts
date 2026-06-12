import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/database'
import { User } from './User'
import { Event } from './Event'

export class Attendance extends Model {
  public id!: number
  public eventId!: number
  public studentId!: number
  public checkedInAt!: Date
  public checkedById!: number
}

Attendance.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Event,
        key: 'id'
      }
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    checkedInAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    checkedById: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    }
  },
  {
    sequelize,
    tableName: 'attendances',
    timestamps: false
  }
)

Attendance.belongsTo(Event, { as: 'event', foreignKey: 'eventId' })
Attendance.belongsTo(User, { as: 'student', foreignKey: 'studentId' })
Attendance.belongsTo(User, { as: 'checkedBy', foreignKey: 'checkedById' })
