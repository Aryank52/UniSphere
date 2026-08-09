import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const databaseUrl = process.env.DATABASE_URL

export let sequelize: Sequelize

if (databaseUrl) {
  console.log('🐘 Connecting to PostgreSQL production database...')
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 15,
      min: 2,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    }
  })
} else {
  console.log('📁 No DATABASE_URL found. Falling back to local zero-config SQLite file (unisphere.sqlite)...')
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './unisphere.sqlite',
    logging: false
  })
}
