import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/database'
import { User } from './User'

export class SessionTrack extends Model {
  public id!: number
  public userId!: number
  public tokenJti!: string
  public deviceInfo!: string | null
  public ipAddress!: string | null
  public isActive!: boolean
  public lastActive!: Date
}

SessionTrack.init(
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
    tokenJti: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    deviceInfo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    lastActive: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'session_tracks',
    timestamps: true
  }
)

SessionTrack.belongsTo(User, { as: 'user', foreignKey: 'userId' })
User.hasMany(SessionTrack, { foreignKey: 'userId' })
