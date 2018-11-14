'use strict'

const Model = use('Model')

/** 
*  @swagger
*  definitions:
*    Category:
*      type: object
*      properties:
*        id:
*          type: uint
*        name:
*          type: string
*      required:
*        - name
*/

class Category extends Model {
}

module.exports = Category
