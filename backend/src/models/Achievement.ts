import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/database'

export class Achievement extends Model {
  public id!: number
  public title!: string
  public description!: string
  public badgeImage!: string | null
  public xpBonus!: number
}

Achievement.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    badgeImage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    xpBonus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    sequelize,
    tableName: 'achievements',
    timestamps: true
  }
)
