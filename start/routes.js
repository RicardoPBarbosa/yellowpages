'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', 'HomeController.index').as('home')
Route.get('/results/search', 'HomeController.search')
Route.get('/results/list', 'HomeController.getResults')

// Logged in Routes
Route.group(() => {
  Route.get('/dashboard', 'DashboardController.index').as('dashboard')
  Route.post('/results', 'DashboardController.store')
  Route.post('/results/:id', 'DashboardController.update')
  Route.delete('/results/', 'DashboardController.destroy')
}).middleware('auth')

// Authentication Routes
Route.group(() => {
  Route.get('register', 'RegisterController.showRegisterForm').middleware('authenticated')
  Route.post('register', 'RegisterController.register').as('register')
  Route.get('register/confirm/:token', 'RegisterController.confirmEmail')
  Route.get('login', 'LoginController.showLoginForm').middleware('authenticated')
  Route.post('login', 'LoginController.login').as('login')
  Route.get('logout', 'AuthenticatedController.logout')
  Route.get('password/reset', 'PasswordResetController.showLinkRequestForm').middleware('authenticated')
  Route.post('password/email', 'PasswordResetController.sendResetLinkEmail').as('password.email')
  Route.get('password/reset/:token', 'PasswordResetController.showResetForm')
  Route.post('password/reset/', 'PasswordResetController.reset').as('password.reset')
}).namespace('Auth')