
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
        { id: 1, outsideId: 1, width: 24, height: 36, border: 3.5 },
        { id: 2, outsideId: 8, insideId: 9, rabbetId: 10, width: 45, height: 32, border: 1 },

        { id: 3, outsideId: 2, width: 7, height: 7, border: 1.75 },
        { id: 4, outsideId: 2, width: 10, height: 10, border: 2.25 },
        { id: 5, outsideId: 2, width: 13, height: 13, border: 2.75 },
        { id: 6, outsideId: 2, width: 17, height: 17, border: 2.75 },
        { id: 7, outsideId: 2, width: 19, height: 19, border: 2.75 },
        { id: 8, outsideId: 2, width: 24, height: 24, border: 3 },
        { id: 9, outsideId: 2, width: 30, height: 30, border: 3.5 },
        { id: 10, outsideId: 2, width: 36, height: 36, border: 3.5 },

        { id: 11, outsideId: 23, width: 16, height: 18, border: 2.5 },
        { id: 12, outsideId: 24, width: 22, height: 24, border: 2.75 },
        { id: 13, outsideId: 25, width: 30, height: 33, border: 3.5 },

        { id: 14, outsideId: 4, width: 11.5, height: 14.5, border: 2.5 },
        { id: 15, outsideId: 4, width: 14, height: 20, border: 2.75 },
        { id: 16, outsideId: 4, width: 18.5, height: 22.5, border: 3 },
        { id: 17, outsideId: 4, width: 22, height: 28, border: 3.5 },
        { id: 18, outsideId: 4, width: 26, height: 36, border: 3.75 },

        { id: 19, outsideId: 26, insideId: 27, rabbetId: 28, width: 21.3188, height: 21.3188, border: 1 },
        { id: 20, outsideId: 29, insideId: 30, rabbetId: 31, width: 22.69, height: 22.49, border: 1 },
        { id: 21, outsideId: 32, insideId: 33, width: 23.2, height: 23, border: 1 },
        { id: 22, outsideId: 34, insideId: 35, rabbetId: 36, width: 6.62, height: 6.6, border: 1 },
        { id: 23, outsideId: 37, insideId: 38, rabbetId: 39, width: 9.75, height: 9.75, border: 1 },
        { id: 24, outsideId: 40, insideId: 41, rabbetId: 42, width: 13.28, height: 13.28, border: 1 },
        { id: 25, outsideId: 43, insideId: 44, width: 20.4, height: 20.24, border: 1 },
        { id: 26, outsideId: 43, insideId: 44, width: 25.75, height: 25.5, border: 1 },

        { id: 27, outsideId: 45, insideId: 46, rabbetId: 47, width: 24, height: 24, border: 1 },

        { id: 28, outsideId: 48, width: 16, height: 36, border: 2.5 },
        { id: 29, outsideId: 48, width: 18, height: 50, border: 3 },
        { id: 30, outsideId: 49, width: 16, height: 36, border: 2.5 },
        { id: 31, outsideId: 49, width: 18, height: 50, border: 3 },

        { id: 32, outsideId: 5, width: 11.5, height: 18.5, border: 2.5 },
        { id: 33, outsideId: 5, width: 14, height: 32, border: 2.5 },
        { id: 34, outsideId: 5, width: 18, height: 27, border: 3 },
        { id: 35, outsideId: 5, width: 18, height: 40, border: 3.25 },
        { id: 36, outsideId: 5, width: 18, height: 48, border: 3.25 },
        { id: 37, outsideId: 5, width: 24, height: 28, border: 3.5 },
        { id: 38, outsideId: 5, width: 25, height: 36, border: 4.25 },

        { id: 39, outsideId: 6, width: 12, height: 12, border: 2.75 },
        { id: 40, outsideId: 6, width: 24, height: 24, border: 3.5 },
        { id: 41, outsideId: 6, width: 30, height: 30, border: 3.5 },

        { id: 42, outsideId: 50, width: 17.125, height: 61, border: 3 },
     ])
  },

  async down( queryInterface, Sequelize )
  {
    return queryInterface.bulkDelete( 'SubstrateInfos', null, {} )
  }
}
