import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/database'
import { User } from './User'

export class Club extends Model {
  public id!: number
  public name!: string
  public description!: string
  public bannerImage!: string
  public creatorId!: number
  public membersCount!: number
  public status!: 'PENDING' | 'ACTIVE'
}

Club.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    bannerImage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    membersCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'ACTIVE'),
      allowNull: false,
      defaultValue: 'PENDING'
    }
  },
  {
    sequelize,
    tableName: 'clubs',
    timestamps: true
  }
)

Club.belongsTo(User, { as: 'creator', foreignKey: 'creatorId' })
User.hasMany(Club, { foreignKey: 'creatorId' })
