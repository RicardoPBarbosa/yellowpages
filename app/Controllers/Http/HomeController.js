'use strict'

const Result = use('App/Models/Result')

class HomeController {
  /**
  * @swagger
  * /:
  *   get:
  *     tags:
  *       - Home
  *     summary: Homepage of the App
  *     parameters:
  *     responses:
  *       200:
  *         description: Returns the home view with the featured results and number of pages of results available
  *         example:
  *           pages: 5
  *           featured:
  *             id: 32
  *             name: Google
  *             email: google@email.com
  *             phone: (747) 693-4305
  *             address: Silicon Valley 005
  *             postal_code: 4444-005
  *             locality: California
  *             logo: 1540328212107.png
  *             search_count: 24
  *             longitude: 37.387603
  *             latitude: -122.090074
  *             created_at: 2018-10-23 20:56:52
  *             updated_at: 2018-10-31 19:55:26
  */
  async index({ view }) {
    let pages    = await Result.getCount()
    pages        = Math.ceil(pages / 3)
    let featured = null
    if (await Result.query().where('search_count', '>', 0).getCount() > 0) {
      featured = await Result.query().where('search_count', '>', 0).orderBy('search_count', 'desc').pick(4)
    }

    return view.render('home', {
      pages:    pages,
      featured: featured ? featured.toJSON(): []
    })
  }

  /**
  * @swagger
  * /results/list:
  *   get:
  *     tags:
  *       - Home
  *     summary: Results of the first page for the homepage
  *     parameters:
  *     responses:
  *       200:
  *         description: Returns three results depending on the current page
  *         example:
  *           results:
  *             id: 32
  *             name: Google
  *             email: google@email.com
  *             phone: (747) 693-4305
  *             address: Silicon Valley 005
  *             postal_code: 4444-005
  *             locality: California
  *             logo: 1540328212107.png
  *             search_count: 24
  *             longitude: 37.387603
  *             latitude: -122.090074
  *             created_at: 2018-10-23 20:56:52
  *             updated_at: 2018-10-31 19:55:26
  */
  async getResults({ request, response }) {
    const results = await Result.query().orderBy('name', 'asc').paginate(request.input('page'), 3)
    return response.json({
      results
    })
  }

  /**
  * @swagger
  * /results/search:
  *   get:
  *     tags:
  *       - Home
  *     summary: Results for a search made in the homepage form
  *     parameters:
  *     responses:
  *       200:
  *         description: Returns the matches for the search made
  *         example:
  *           results:
  *             id: 32
  *             name: Google
  *             email: google@email.com
  *             phone: (747) 693-4305
  *             address: Silicon Valley 005
  *             postal_code: 4444-005
  *             locality: California
  *             logo: 1540328212107.png
  *             search_count: 24
  *             longitude: 37.387603
  *             latitude: -122.090074
  *             created_at: 2018-10-23 20:56:52
  *             updated_at: 2018-10-31 19:55:26
  */
  async search({ request, response, session, view }) {
    let results = null
    const page = request.input('page') ? request.input('page') : 1
    if (request.input('name')) {
      let searchName = request.input('name').replace(' ', '%')
      searchName     = searchName.toLowerCase()
      if (request.input('place')) {
        let searchPlace = request.input('place').replace(' ', '%')
        searchPlace = searchPlace.toLowerCase()
        results = await Result.query()
                  .whereRaw('LOWER(name) like ?', ['%'+searchName+'%'])
                  .andWhereRaw('LOWER(address) like ?', ['%'+searchPlace+'%'])
                  .orWhereRaw('LOWER(locality) like ?', ['%'+searchPlace+'%'])
                  .paginate(page, 3)
      } else {
        results = await Result.query()
                  .whereRaw('LOWER(name) like ?', ['%'+searchName+'%'])
                  .paginate(page, 3)
      }
    } else if (request.input('place')) {
      let searchPlace = request.input('place').replace(' ', '%')
      searchPlace = searchPlace.toLowerCase()
      results = await Result.query()
                .whereRaw('LOWER(address) like ?', ['%'+searchPlace+'%'])
                .orWhereRaw('LOWER(locality) like ?', ['%'+searchPlace+'%'])
                .paginate(page, 3)
    }

    if (results && results.toJSON().data.length > 0) {
      // update search count for the results
      for (let i = 0; i < results.toJSON().data.length; i++) {
        const result = await Result.find(results.toJSON().data[i].id)
        result.search_count += 1
        await result.save()
      }
      return view.render('search', {
        results: results.toJSON(),
        url: request.url() + '?name=' + request.input('name') + '&place=' + request.input('place')
      })
    }
    session.flash({
      notification: {
        type: 'danger',
        message: 'Não existem resultados para esta pesquisa.'
      }
    })

    return response.redirect('back')
  }
}

module.exports = HomeController
