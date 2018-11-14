'use strict'

const { validateAll } = use('Validator')
const User = use('App/Models/User')
const randomString = require('randomstring')
const Mail = use('Mail')

class RegisterController {
  showRegisterForm ({ view }) {
    return view.render('auth.register')
  }

  async register ({ request, session, response }) {
    // validate form inputs
    const rules = {
      username: 'required|unique:users,username',
      email: 'required|email|unique:users,email',
      password: 'required'
    }
    const validation = await validateAll(request.all(), rules)

    if (validation.fails()) {
      session
        .withErrors(validation.messages())
        .flashExcept(['password'])

      return response.redirect('back')
    }
    // create new user
    const user = await User.create({
      username: request.input('username'),
      email: request.input('email'),
      password: request.input('password'),
      confirmation_token: randomString.generate({ length: 40 })
    })
    // send confirmation email
    await Mail.send('auth.emails.confirm_email', user.toJSON(), message => {
      message
        .to(user.email)
        .from('no-reply@yellowpages.com')
        .subject('Please confirm your email address')
    })
    // display success message
    session.flash({
      notification: {
        type: 'success',
        message: 'Registration successful! A mail has been sent to your email address, please confirm your email address.'
      }
    })

    return response.redirect('back')
  }

  async confirmEmail ({ params, session, response }) {
    // get user with the confirmation token
    const user = await User.findBy('confirmation_token', params.token)

    // set confirmation to null and is_active to true
    user.confirmation_token = null
    user.is_active = true

    // persist user to database
    await user.save()

    // display success message
    session.flash({
      notification: {
        type: 'success',
        message: 'Your email address has been confirmed.'
      }
    })

    return response.redirect('/login')
  }
}

module.exports = RegisterController
