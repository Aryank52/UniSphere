import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/database'

export class User extends Model {
  public id!: number
  public name!: string
  public email!: string
  public password!: string
  public role!: 'STUDENT' | 'FACULTY' | 'COORDINATOR' | 'ADMIN'
  public department!: string | null
  public academicYear!: number | null
  public interests!: string[] | null
  public skills!: string[] | null
  public preferredCategories!: string[] | null
  public xpPoints!: number
  public level!: number
  public isEmailVerified!: boolean
  public twoFactorSecret!: string | null
  public isTwoFactorEnabled!: boolean
  public profileImage!: string | null
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
      type: DataTypes.ENUM('STUDENT', 'FACULTY', 'COORDINATOR', 'ADMIN'),
      allowNull: false,
      defaultValue: 'STUDENT'
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true
    },
    academicYear: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    interests: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    skills: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    preferredCategories: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    xpPoints: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    twoFactorSecret: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isTwoFactorEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
