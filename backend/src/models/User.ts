import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/database'

export class User extends Model {
  public id!: number
  public name!: string
  public email!: string
  public password!: string
  public role!: 'STUDENT' | 'FACULTY' | 'ADMIN'
  public department!: string
  public profileImage!: string
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('STUDENT', 'FACULTY', 'ADMIN'),
      allowNull: false,
      defaultValue: 'STUDENT'
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true
  }
)
