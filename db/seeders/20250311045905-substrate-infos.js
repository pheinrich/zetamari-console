'use strict'

module.exports =
{
  async up( queryInterface, Sequelize )
  {
    // NB: bulkInsert() respects defaultValue only if EVERY row in the request
    // omits it. If even one row explicitly supplies a value for a column de-
    // fined with a defaultValue, NULL will be inserted (for that column) into
    // all the rows that don't.
    return queryInterface.bulkInsert(
      'SubstrateInfos',
      [
        { materialId: 1, outsideId: 1, length: 24, height: 36, border: 3.5 },
        { materialId: 2, outsideId: 8, insideId: 9, rabbetId: 10, length: 45, height: 32, border: 1 },

        { materialId: 3, outsideId: 2, length: 7, height: 7, border: 1.75 },
        { materialId: 4, outsideId: 2, length: 10, height: 10, border: 2.25 },
        { materialId: 5, outsideId: 2, length: 13, height: 13, border: 2.75 },
        { materialId: 6, outsideId: 2, length: 17, height: 17, border: 2.75 },
        { materialId: 7, outsideId: 2, length: 19, height: 19, border: 2.75 },
        { materialId: 8, outsideId: 2, length: 24, height: 24, border: 3 },
        { materialId: 9, outsideId: 2, length: 30, height: 30, border: 3.5 },
        { materialId: 10, outsideId: 2, length: 36, height: 36, border: 3.5 },

        { materialId: 11, outsideId: 11, insideId: 12, rabbetId: 13, length: 8, height: 18, border: 1 },
        { materialId: 12, outsideId: 14, insideId: 15, rabbetId: 16, length: 10, height: 24, border: 1 },
        { materialId: 13, outsideId: 17, insideId: 18, rabbetId: 19, length: 14, height: 24, border: 1 },
        { materialId: 14, outsideId: 20, insideId: 21, rabbetId: 22, length: 34, height: 24, border: 1 },
        { materialId: 15, outsideId: 20, insideId: 21, rabbetId: 22, length: 44, height: 31, border: 1 },

        { materialId: 16, outsideId: 3, length: 9.875, height: 15.625, border: 2.25 },

        { materialId: 17, outsideId: 23, length: 16, height: 18, border: 2.5 },
        { materialId: 18, outsideId: 24, length: 22, height: 24, border: 2.75 },
        { materialId: 19, outsideId: 25, length: 30, height: 33, border: 3.5 },

        { materialId: 20, outsideId: 4, length: 11.5, height: 14.5, border: 2.5 },
        { materialId: 21, outsideId: 4, length: 14, height: 20, border: 2.75 },
        { materialId: 22, outsideId: 4, length: 18.5, height: 22.5, border: 3 },
        { materialId: 23, outsideId: 4, length: 22, height: 28, border: 3.5 },
        { materialId: 24, outsideId: 4, length: 22, height: 34, border: 3.5 },
        { materialId: 25, outsideId: 4, length: 26, height: 36, border: 3.75 },

        { materialId: 26, outsideId: 26, insideId: 27, rabbetId: 28, length: 21.3188, height: 21.3188, border: 1 },
        { materialId: 27, outsideId: 29, insideId: 30, rabbetId: 31, length: 22.69, height: 22.49, border: 1 },
        { materialId: 28, outsideId: 32, insideId: 33, length: 23.2, height: 23, border: 1 },
        { materialId: 29, outsideId: 34, insideId: 35, rabbetId: 36, length: 6.62, height: 6.6, border: 1 },
        { materialId: 30, outsideId: 37, insideId: 38, rabbetId: 39, length: 9.75, height: 9.75, border: 1 },
        { materialId: 31, outsideId: 40, insideId: 41, rabbetId: 42, length: 13.28, height: 13.28, border: 1 },
        { materialId: 32, outsideId: 43, insideId: 44, length: 20.4, height: 20.24, border: 1 },
        { materialId: 33, outsideId: 43, insideId: 44, length: 25.75, height: 25.5, border: 1 },

        { materialId: 34, outsideId: 45, insideId: 46, rabbetId: 47, length: 24, height: 24, border: 1 },

        { materialId: 35, outsideId: 48, length: 16, height: 36, border: 2.5 },
        { materialId: 36, outsideId: 48, length: 18, height: 50, border: 3 },
        { materialId: 37, outsideId: 49, length: 16, height: 36, border: 2.5 },
        { materialId: 38, outsideId: 49, length: 18, height: 50, border: 3 },

        { materialId: 39, outsideId: 5, length: 11.5, height: 18.5, border: 2.5 },
        { materialId: 40, outsideId: 5, length: 14, height: 32, border: 2.5 },
        { materialId: 41, outsideId: 5, length: 18, height: 27, border: 3 },
        { materialId: 42, outsideId: 5, length: 18, height: 40, border: 3.25 },
        { materialId: 43, outsideId: 5, length: 18, height: 48, border: 3.25 },
        { materialId: 44, outsideId: 5, length: 24, height: 28, border: 3.5 },
        { materialId: 45, outsideId: 5, length: 25, height: 36, border: 4.25 },

        { materialId: 46, outsideId: 6, length: 12, height: 12, border: 2.75 },
        { materialId: 47, outsideId: 6, length: 24, height: 24, border: 3.5 },
        { materialId: 48, outsideId: 6, length: 30, height: 30, border: 3.5 },

        { materialId: 49, outsideId: 50, length: 17.125, height: 61, border: 3 },
     ])
  },

  async down( queryInterface, Sequelize )
  {
    return queryInterface.bulkDelete( 'SubstrateInfos', null, {} )
  }
}
