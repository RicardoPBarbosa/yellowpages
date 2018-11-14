'use strict'

const Schema = use('Schema')

class ResultSchema extends Schema {
  up () {
    this.create('results', (table) => {
      table.increments()
      table.string('name').notNullable()
      table.string('email').notNullable().unique()
      table.string('phone').notNullable().unique()
      table.string('address').notNullable()
      table.string('postal_code').notNullable()
      table.string('locality')
      table.string('logo')
      table.integer('search_count').defaultTo(0)
      table.string('longitude')
      table.string('latitude')
      table.integer('category_id', 11).unsigned().references('id').inTable('categories')
      table.timestamps()
    })
  }

  down () {
    this.drop('results')
  }
}

module.exports = ResultSchema
