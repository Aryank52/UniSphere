import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/database'
import { User } from './User'
import { Club } from './Club'

export class Event extends Model {
  public id!: number
  public title!: string
  public description!: string
  public date!: string
  public time!: string
  public location!: string
  public campus!: string
  public maxCapacity!: number
  public status!: 'PENDING' | 'APPROVED' | 'REJECTED'
  public bannerImage!: string
  public category!: 'TECH' | 'SPORTS' | 'ACADEMIC' | 'CULTURAL'
  public clubId!: number
  public coordinatorId!: number
  public engagementScore!: number
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    campus: {
      type: DataTypes.STRING,
      allowNull: true
    },
    maxCapacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
      allowNull: false,
      defaultValue: 'PENDING'
    },
    bannerImage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    category: {
      type: DataTypes.ENUM('TECH', 'SPORTS', 'ACADEMIC', 'CULTURAL'),
      allowNull: false,
      defaultValue: 'TECH'
    },
    clubId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Club,
        key: 'id'
      }
    },
    coordinatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    engagementScore: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0
    }
  },
  {
    sequelize,
    tableName: 'events',
    timestamps: true
  }
)

Event.belongsTo(Club, { as: 'club', foreignKey: 'clubId' })
Club.hasMany(Event, { foreignKey: 'clubId' })

Event.belongsTo(User, { as: 'coordinator', foreignKey: 'coordinatorId' })
User.hasMany(Event, { foreignKey: 'coordinatorId' })
