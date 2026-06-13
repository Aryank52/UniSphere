import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/database'

export class Venue extends Model {
  public id!: number
  public name!: string
  public locationDetails!: string
  public latitude!: number | null
  public longitude!: number | null
  public capacity!: number
}

Venue.init(
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
    locationDetails: {
      type: DataTypes.STRING,
      allowNull: false
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'venues',
    timestamps: true
  }
)
