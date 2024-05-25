module.exports =
{
  async up( queryInterface, Sequelize )
  {
    return queryInterface.bulkInsert( 'shapes',
      [
        { name: 'Chapel Arch', prefix: 'Ca', isPrimitive: true },
        { name: 'Circle', prefix: 'Ci', isPrimitive: true },
        { name: 'Gothic Arch', prefix: 'Ga', isPrimitive: true },
        { name: 'Oval', prefix: 'Ov', isPrimitive: true },
        { name: 'Rectangle', prefix: 'Re', isPrimitive: true },
        { name: 'Square', prefix: 'Sq', isPrimitive: true },
        { name: 'Vesica Piscis', prefix: 'Vp', isPrimitive: true },

        { name: 'Cora', prefix: 'Cr', isPrimitive: false },
        { name: 'Leaf', prefix: 'Lr', isPrimitive: false },
        { name: 'Mandala, Avens', prefix: 'MdAv', isPrimitive: false },
        { name: 'Mandala, Planet', prefix: 'MdPl', isPrimitive: false },
        { name: 'Mandala, Sonora', prefix: 'MdSn', isPrimitive: false },
        { name: 'Mandala, Starlight', prefix: 'MdSl', isPrimitive: false },
        { name: 'Mina', prefix: 'Mn', isPrimitive: false },
        { name: 'Neslo', prefix: 'Ne', isPrimitive: false },
        { name: 'Neslo Whimsy', prefix: 'Nw', isPrimitive: false },
        { name: 'Willow Leaf', prefix: 'Wf', isPrimitive: false }
      ])
  },

  async down( queryInterface, Sequelize )
  {
    return queryInterface.bulkDelete( 'shapes', null, {} )
  }
}
