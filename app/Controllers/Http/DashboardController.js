'use strict'

const Category        = use('App/Models/Category')
const Result          = use('App/Models/Result')
const { validateAll } = use('Validator')
const Helpers         = use('Helpers')
const Drive           = use('Drive')

class DashboardController {
  /**
  * @swagger
  * /dashboard:
  *   get:
  *     tags:
  *       - Dashboard
  *     summary: Returns the dashboard view for creating, editing and deleting results, and returns the existing results
  *     parameters:
  *     responses:
  *       200:
  *         description: Returns the available results
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
  async index({ view, page }) {
    const results = await Result.query().orderBy('id', 'desc').fetch()

    return view.render('dashboard', {
      results: results.toJSON()
    })
  }

  /**
  * @swagger
  * /results:
  *   post:
  *     tags:
  *       - Dashboard
  *     summary: Creates a new result
  *     parameters:
  *       - name: name
  *         description: Name of the result
  *         required: true
  *       - email: email
  *         description: email of the result
  *         required: true
  *       - phone: phone
  *         description: phone of the result
  *         required: true
  *       - address: address
  *         description: address of the result
  *         required: true
  *       - postal_code: postal code
  *         description: Postal code of the result
  *         required: true
  *     responses:
  *       200:
  */
  async store({ request, response, session }) {
    // validate form inputs
    const rules = {
      name: 'required',
      email: 'required|email|unique:results,email',
      phone: 'required|unique:results,phone',
      address: 'required',
      postal_code: 'required',
    }
    const messages = {
      'name.required'     : 'Campo obrigatório.',
      'email.required'    : 'Campo obrigatório.',
      'email.email'       : 'Formato de email errado.',
      'email.unique'      : 'Email já existe.',
      'phone.required'    : 'Campo obrigatório.',
      'phone.unique'      : 'Contacto já existe.',
      'address.required'  : 'Campo obrigatório.',
      'postal_code.required'  : 'Campo obrigatório.',
    }
    const validation = await validateAll(request.all(), rules, messages)

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()

      return response.redirect('back')
    }

    const result = new Result()
    result.name = request.input('name')
    result.email = request.input('email')
    result.phone = request.input('phone')
    result.address = request.input('address')
    result.postal_code = request.input('postal_code')
    result.locality = request.input('locality') ? request.input('locality') : null
    result.longitude = request.input('longitude') ? request.input('longitude') : null
    result.latitude = request.input('latitude') ? request.input('latitude') : null

    const logo = request.file('logo')
    if (logo.clientName) {
      result.logo = new Date().getTime() + '.' + logo.subtype
  
      await logo.move(Helpers.publicPath('storage/uploads/results'), {
        name: result.logo
      })
    } else {
      result.logo = 'placeholder.png'
    }
    await result.save()

    session.flash({
      notification: {
        type: 'success',
        message: 'Nova empresa criada com sucesso.'
      }
    })

    return response.redirect('back')
  }

  /**
  * @swagger
  * /results/{id}:
  *   post:
  *     tags:
  *       - Dashboard
  *     summary: Updates a result
  *     parameters:
  *       - name: name of the new result
  *       - email: email
  *       - phone: phone
  *       - address: address
  *       - postal_code: postal code
  *     responses:
  *       200:
  */
  async update({ params, request, session, response }) {
    const { id } = params
    const result = await Result.find(id)
    
    switch (request.input('type')) {
      case 'name':
        result.name = request.input('value')
        break;
      case 'email':
        result.email = request.input('value')
        break;
      case 'phone':
        result.phone = request.input('value')
        break;
      case 'address':
        result.address = request.input('value')
        break;
      case 'postal_code':
        result.postal_code = request.input('value')
        break;
      case 'locality':
        result.locality = request.input('value')
        break;
      default:
        break;
    }
    await result.save()

    return response.json({})
  }

  /**
  * @swagger
  * /results:
  *   delete:
  *     tags:
  *       - Dashboard
  *     summary: Deletes a result
  *     parameters:
  *       - id: id of the result
  *     responses:
  *       200:
  */
  async destroy({ request, session, response }) {
    const result = await Result.find(request.input('id'))

    if (result.logo && result.logo !== 'placeholder.png') {
      await Drive.delete(Helpers.publicPath('storage/uploads/results/' + result.logo))
    }

    await result.delete()

    session.flash({
      notification: {
        type: 'success',
        message: 'Empresa eliminada com sucesso.'
      }
    })

    return response.redirect('back')
  }
}

module.exports = DashboardController
