'use strict'

/*
|--------------------------------------------------------------------------
| ResultSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class ResultSeeder {
  async run () {
    await Factory.model('App/Models/Result').createMany(15)
  }
}

module.exports = ResultSeeder
