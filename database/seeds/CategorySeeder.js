'use strict'

/*
|--------------------------------------------------------------------------
| CategorySeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Factory = use('Factory')
const Database = use('Database')

class CategorySeeder {
  async run () {
    await Database.table('categories').insert({ 
      name: 'Diversos',
      created_at: Database.fn.now(),
      updated_at: Database.fn.now()
    })
    await Database.table('categories').insert({ 
      name: 'Restaurantes',
      created_at: Database.fn.now(),
      updated_at: Database.fn.now()
    })
    await Database.table('categories').insert({ 
      name: 'Farmácias',
      created_at: Database.fn.now(),
      updated_at: Database.fn.now()
    })
    await Database.table('categories').insert({ 
      name: 'Ginásios',
      created_at: Database.fn.now(),
      updated_at: Database.fn.now()
    })
    await Database.table('categories').insert({ 
      name: 'Advogados',
      created_at: Database.fn.now(),
      updated_at: Database.fn.now()
    })
  }
}

module.exports = CategorySeeder
