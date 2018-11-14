'use strict'

const { validate, validateAll } = use('Validator')
const User = use('App/Models/User')
const PasswordReset = use('App/Models/PasswordReset')
const randomString = require('randomstring')
const Mail = use('Mail')
const Hash = use('Hash')

class PasswordResetController {
  showLinkRequestForm ({ view }) {
    return view.render('auth.passwords.email')
  }

  async sendResetLinkEmail ({ request, session, response }) {
    // validate form inputs
    const validation = await validate(request.only('email'), {
      email: 'required|email'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()

      return response.redirect('back')
    }

    try {
      // get user
      const user = await User.findBy('email', request.input('email'))

      await PasswordReset.query().where('email', user.email).delete()

      const { token } = await PasswordReset.create({
        email: user.email,
        token: randomString.generate({ lenght: 40 })
      })

      const mailData = {
        user: user.toJSON(),
        token
      }

      await Mail.send('auth.emails.password_reset', mailData, message => {
        message
          .to(user.email)
          .from('no-reply@yellowpages.com')
          .subject('Password reset link')
      })

      session.flash({
        notification: {
          type: 'success',
          message: 'A password reset link as been sent to your email address.'
        }
      })

      return response.redirect('back')
    } catch (error) {
      session.flash({
        notification: {
          type: 'danger',
          message: 'There is no registered user with this email address.'
        }
      })

      return response.redirect('back')
    }
  }

  showResetForm ({ params, view }) {
    return view.render('auth.passwords.reset', { token: params.token })
  }

  async reset ({ request, session, response }) {
    // validate form inputs
    const rules = {
      token: 'required',
      email: 'required|email',
      password: 'required|confirmed'
    }

    const validation = await validateAll(request.all(), rules)

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashExcept(['password', 'password_confirmation'])

      return response.redirect('back')
    }

    try {
      // get user by the provided email
      const user = await User.findBy('email', request.input('email'))

      // FAZER DEBUG QUE RESET DA PASS NAO FUNCIONA

      // check if password reset token exists for the user
      const token = await PasswordReset.query()
        .where('email', user.email)
        .where('token', request.input('token'))
        .first()

        if (!token) {
          // display error message
          session.flash({
            notification: {
              type: 'danger',
              message: 'This password reset token is invalid.'
            }
          })

          return response.redirect('back')
        }

        // user.password = await Hash.make(request.input('password'))
        // password gets Hash'ed on the hook "beforeSave" on User Model
        user.password = request.input('password')
        await user.save()

        // delete password reset token
        await PasswordReset.query().where('email', user.email).delete()

        // display success message
        session.flash({
          notification: {
            type: 'success',
            message: 'Your password has been reset!'
          }
        })

        return response.redirect('/login')
    } catch (error) {
      session.flash({
        notification: {
          type: 'danger',
          message: 'There is no registered user with this email address.'
        }
      })

      return response.redirect('back')
    }
  }
}

module.exports = PasswordResetController
