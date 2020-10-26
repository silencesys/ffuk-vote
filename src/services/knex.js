import knex from 'knex'
import dbConfig from '../configs/db.oracle'

export default knex({
  client: 'oracledb',
  connection: {
    connectString: dbConfig.connectionString,
    user: dbConfig.username,
    password: dbConfig.password
  },
  pool: {
    min: dbConfig.pools.min,
    max: dbConfig.pools.max
  }
})
