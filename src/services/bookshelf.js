import knex from './knex'
import Bookshelf from 'bookshelf'
import Virtuals from 'bookshelf-virtuals-plugin'

const bookshelf = Bookshelf(knex)
bookshelf.plugin(Virtuals)

export default bookshelf
