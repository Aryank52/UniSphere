import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/database'
import { User } from './User'
import { Event } from './Event'

export class Registration extends Model {
  public id!: number
  public eventId!: number
  public studentId!: number
  public status!: 'REGISTERED' | 'CANCELLED'
  public passCode!: string
  public event!: Event
  public student!: User
}

Registration.init(
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
    status: {
      type: DataTypes.ENUM('REGISTERED', 'CANCELLED', 'WAITLISTED'),
      allowNull: false,
      defaultValue: 'REGISTERED'
    },
    passCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize,
    tableName: 'registrations',
    timestamps: true
  }
)

Registration.belongsTo(Event, { as: 'event', foreignKey: 'eventId' })
Event.hasMany(Registration, { foreignKey: 'eventId' })

Registration.belongsTo(User, { as: 'student', foreignKey: 'studentId' })
User.hasMany(Registration, { foreignKey: 'studentId' })
