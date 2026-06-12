import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/database'
import { User } from './User'
import { Event } from './Event'

export class Feedback extends Model {
  public id!: number
  public eventId!: number
  public studentId!: number
  public rating!: number
  public comment!: string
}

Feedback.init(
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
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'feedbacks',
    timestamps: true
  }
)

Feedback.belongsTo(Event, { as: 'event', foreignKey: 'eventId' })
Feedback.belongsTo(User, { as: 'student', foreignKey: 'studentId' })
