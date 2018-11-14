'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

// Factory.blueprint('App/Models/User', (faker) => {
//   return {
//     username: faker.username()
//   }
// })

Factory.blueprint('App/Models/Result', (faker) => {
  return {
    name: faker.company(),
    email: faker.email(),
    phone: faker.phone(),
    address: faker.address(),
    postal_code: faker.zip(),
    locality: faker.city(),
    logo: 'placeholder.png',
    longitude: faker.longitude(),
    latitude: faker.latitude(),
    category_id: faker.d4()
  }
})
