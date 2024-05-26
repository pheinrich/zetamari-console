module.exports =
{
  async up( queryInterface, Sequelize )
  {
    return queryInterface.bulkInsert( 'shapes',
      [
        { id: 1, name: 'Chapel Arch', prefix: 'Ca', isPrimitive: true },
        { id: 2, name: 'Circle', prefix: 'Ci', isPrimitive: true },
        { id: 3, name: 'Gothic Arch', prefix: 'Ga', isPrimitive: true },
        { id: 4, name: 'Oval', prefix: 'Ov', isPrimitive: true },
        { id: 5, name: 'Rectangle', prefix: 'Re', isPrimitive: true },
        { id: 6, name: 'Square', prefix: 'Sq', isPrimitive: true },
        { id: 7, name: 'Vesica Piscis', prefix: 'Vp', isPrimitive: true },

        { id: 8, name: 'Cora', prefix: 'Cr', isPrimitive: false },
        { id: 9, name: 'Leaf', prefix: 'Lr', isPrimitive: false },
        { id: 10, name: 'Mandala, Avens', prefix: 'MdAv', isPrimitive: false },
        { id: 11, name: 'Mandala, Planet', prefix: 'MdPl', isPrimitive: false },
        { id: 12, name: 'Mandala, Sonora', prefix: 'MdSn', isPrimitive: false },
        { id: 13, name: 'Mandala, Starlight', prefix: 'MdSl', isPrimitive: false },
        { id: 14, name: 'Mina', prefix: 'Mn', isPrimitive: false },
        { id: 15, name: 'Neslo', prefix: 'Ne', isPrimitive: false },
        { id: 16, name: 'Neslo Whimsy', prefix: 'Nw', isPrimitive: false },
        { id: 17, name: 'Willow Leaf', prefix: 'Wf', isPrimitive: false }
      ])
  },

  async down( queryInterface, Sequelize )
  {
    return queryInterface.bulkDelete( 'shapes', null, {} )
  }
}
