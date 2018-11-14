'use strict'

const Model = use('Model')

/** 
*  @swagger
*  definitions:
*    Result:
*      type: object
*      properties:
*        id:
*          type: uint
*        name:
*          type: string
*        email:
*          type: string
*        phone:
*          type: string
*        address:
*          type: string
*        postal_code:
*          type: string
*        locality:
*          type: string
*        logo:
*          type: string
*        search_count:
*          type: unit
*        longitude:
*          type: string
*        latitude:
*          type: string
*      required:
*        - name
*        - email
*        - phone
*        - address
*        - postal_code
*/

class Result extends Model {
  category () {
    return this.belongsTo('App/Models/Category')
  }
}

module.exports = Result
