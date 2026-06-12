import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/database'
import { User } from './User'
import { Event } from './Event'

export class Recommendation extends Model {
  public id!: number
  public studentId!: number
  public eventId!: number
  public score!: number
  public recommendationReason!: string
}

Recommendation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Event,
        key: 'id'
      }
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.5
    },
    recommendationReason: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'recommendations',
    timestamps: true
  }
)

Recommendation.belongsTo(Event, { as: 'event', foreignKey: 'eventId' })
Recommendation.belongsTo(User, { as: 'student', foreignKey: 'studentId' })
