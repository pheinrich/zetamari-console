module.exports =
{
  async up( queryInterface, Sequelize )
  {
    return queryInterface.bulkInsert( 'substrates',
      [
        { outsideId: 1, name: 'Chapel Arch', sku: 'Ca1153', width: 11.375, height: 53.375, border: 3, isStock: true, isPreset: false, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 1, name: 'Chapel Arch', sku: 'Ca1860', width: 18, height: 60, border: 3, isStock: true, isPreset: false, createdAt: new Date(), updatedAt: new Date() },

        { outsideId: 2, name: 'Circle', sku: 'Ci7', width: 7, height: 7, border: 1.75, isStock: true, isPreset: false, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 2, name: 'Circle', sku: 'Ci10', width: 10, height: 10, border: 2.25, isStock: true, isPreset: false, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 2, name: 'Circle', sku: 'Ci13', width: 13, height: 13, border: 2.75, isStock: true, isPreset: false, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 2, name: 'Circle', sku: 'Ci17', width: 17, height: 17, border: 2.75, isStock: true, isPreset: true, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 2, name: 'Circle', sku: 'Ci19', width: 19, height: 19, border: 2.75, isStock: true, isPreset: false, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 2, name: 'Circle', sku: 'Ci24', width: 24, height: 24, border: 3, isStock: true, isPreset: false, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 2, name: 'Circle', sku: 'Ci30', width: 30, height: 30, border: 3.5, isStock: true, isPreset: false, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 2, name: 'Circle', sku: 'Ci36', width: 36, height: 36, border: 3.5, isStock: true, isPreset: false, createdAt: new Date(), updatedAt: new Date() },

        { outsideId: 3, name: 'Gothic Arch', sku: 'Ga1016', width: 9.875, height: 15.625, border: 2.25, isStock: true, isPreset: true, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 3, name: 'Gothic Arch', sku: 'Ga1130', width: 11, height: 30, border: 2.5, isStock: true, isPreset: false, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 3, name: 'Gothic Arch', sku: 'Ga1340', width: 13, height: 40, border: 2.5, isStock: true, isPreset: false, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 3, name: 'Gothic Arch', sku: 'Ga2440', width: 24, height: 40, border: 2.75, isStock: true, isPreset: false, createdAt: new Date(), updatedAt: new Date() },

        { outsideId: 4, name: 'Oval', sku: 'Ov1215', width: 11.5, height: 14.5, border: 2.5, isStock: true, isPreset: false, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 4, name: 'Oval', sku: 'Ov1420', width: 14, height: 20, border: 2.75, isStock: true, isPreset: true, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 4, name: 'Oval', sku: 'Ov1822', width: 18.5, height: 22.5, border: 3, isStock: true, isPreset: false, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 4, name: 'Oval', sku: 'Ov2228', width: 22, height: 28, border: 3.5, isStock: true, isPreset: false, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 4, name: 'Oval', sku: 'Ov2234', width: 22, height: 34, border: 3.5, isStock: true, isPreset: false, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 4, name: 'Oval', sku: 'Ov2636', width: 26, height: 36, border: 3.75, isStock: true, isPreset: false, createdAt: new Date(), updatedAt: new Date() },

        { outsideId: 5, name: 'Rectangle', sku: 'Re1118', width: 11.5, height: 18.5, border: 2.5, isStock: true, isPreset: true, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 5, name: 'Rectangle', sku: 'Re1432', width: 14, height: 32, border: 2.5, isStock: true, isPreset: false, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 5, name: 'Rectangle', sku: 'Re1827', width: 18, height: 27, border: 3, isStock: true, isPreset: false, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 5, name: 'Rectangle', sku: 'Re1840', width: 18, height: 40, border: 3.25, isStock: true, isPreset: false, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 5, name: 'Rectangle', sku: 'Re1848', width: 18, height: 48, border: 3.5, isStock: true, isPreset: false, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 5, name: 'Rectangle', sku: 'Re2428', width: 24, height: 28, border: 3.5, isStock: true, isPreset: false, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 5, name: 'Rectangle', sku: 'Re2536', width: 25, height: 36, border: 4.25, isStock: true, isPreset: false, createdAt: new Date(), updatedAt: new Date() },

        { outsideId: 6, name: 'Square', sku: 'Sq12', width: 12, height: 12, border: 2.75, isStock: true, isPreset: true, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 6, name: 'Square', sku: 'Sq24', width: 24, height: 24, border: 3.5, isStock: true, isPreset: false, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 6, name: 'Square', sku: 'Sq30', width: 30, height: 30, border: 3.5, isStock: true, isPreset: false, createdAt: new Date(), updatedAt: new Date() },

        { outsideId: 7, name: 'Vesica Piscis', sku: 'Vp1526', width: 15, height: 25.9808, border: 2.5, isStock: true, isPreset: true, createdAt: new Date(), updatedAt: new Date() },

        { outsideId: 8, insideId: 9, rabbetId: 10, name: 'Cora (Extra Small)', sku: 'Cr818', width: 8, height: 18, border: 1, isStock: true, isPreset: true, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 11, insideId: 12, rabbetId: 13, name: 'Cora (Small)', sku: 'Cr1024', width: 10, height: 24, border: 1, isStock: true, isPreset: true, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 14, insideId: 15, rabbetId: 16, name: 'Cora (Medium)', sku: 'Cr1424', width: 14, height: 24, border: 1, isStock: true, isPreset: true, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 17, insideId: 18, rabbetId: 19, name: 'Cora (Large)', sku: 'Cr3424', width: 33.5, height: 23.5, border: 1, isStock: true, isPreset: true, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 17, insideId: 18, rabbetId: 19, name: 'Cora (Extra Large)', sku: 'Cr4431', width: 44.15, height: 30.66, border: 1, isStock: true, isPreset: false, createdAt: new Date(), updatedAt: new Date() },

        { outsideId: 20, name: 'Leaf (Small)', sku: 'Lr1618', width: 16.24, height: 17.63, border: 2.5, isStock: true, isPreset: true, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 21, name: 'Leaf (Medium)', sku: 'Lr2224', width: 22.24, height: 24.41, border: 2.75, isStock: true, isPreset: true, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 22, name: 'Leaf (Large)', sku: 'Lr3033', width: 29.74, height: 32.89, border: 3.5, isStock: true, isPreset: true, createdAt: new Date(), updatedAt: new Date() },

        { outsideId: 23, insideId: 24, rabbetId: 25, name: 'Mandala, Avens', sku: 'MdAv21', width: 21.3188, height: 21.3188, border: 1, isStock: true, isPreset: true, createdAt: new Date(), updatedAt: new Date() },

        { outsideId: 26, insideId: 27, rabbetId: 28, name: 'Mandala, Planet', sku: 'MdPl23', width: 22.8, height: 22.8, border: 1, isStock: true, isPreset: true, createdAt: new Date(), updatedAt: new Date() },

        { outsideId: 29, insideId: 30, name: 'Mandala, Sonora', sku: 'MdSn23', width: 23.25, height: 23.25, border: 1, isStock: true, isPreset: true, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 29, insideId: 30, name: 'Mandala, Sonora (Large)', sku: 'MdSn27', width: 27.29, height: 27.29, border: 1, isStock: true, isPreset: false, createdAt: new Date(), updatedAt: new Date() },

        { outsideId: 31, insideId: 32, rabbetId: 33, name: 'Mandala, Starlight (Mini)', sku: 'MdSl7', width: 6.62, height: 6.62, border: 1, isStock: true, isPreset: true, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 34, insideId: 35, rabbetId: 36, name: 'Mandala, Starlight (Small)', sku: 'MdSl10', width: 9.76, height: 9.76, border: 1, isStock: true, isPreset: true, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 37, insideId: 38, rabbetId: 39, name: 'Mandala, Starlight (Medium)', sku: 'MdSl14', width: 13.31, height: 13.31, border: 1, isStock: true, isPreset: true, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 40, insideId: 41, name: 'Mandala, Starlight', sku: 'MdSl21', width: 20.24, height: 20.24, border: 1, isStock: true, isPreset: true, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 40, insideId: 41, name: 'Mandala, Starlight (Large)', sku: 'MdSl26', width: 25.56, height: 25.56, border: 1, isStock: true, isPreset: false, createdAt: new Date(), updatedAt: new Date() },

        { outsideId: 42, insideId: 43, rabbetId: 44, name: 'Mina', sku: 'Mn24', width: 23.66, height: 23.66, border: 1, isStock: true, isPreset: true, createdAt: new Date(), updatedAt: new Date() },

        { outsideId: 45, name: 'Neslo', sku: 'Ne1636', width: 16, height: 36, border: 2.5, isStock: true, isPreset: true, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 45, name: 'Neslo (Large)', sku: 'Ne1850', width: 18, height: 50, border: 3, isStock: true, isPreset: false, createdAt: new Date(), updatedAt: new Date() },

        { outsideId: 46, name: 'Neslo Whimsy', sku: 'Nw1636', width: 16, height: 36, border: 2.5, isStock: true, isPreset: true, createdAt: new Date(), updatedAt: new Date() },
        { outsideId: 46, name: 'Neslo Whimsy (Large)', sku: 'Nw1850', width: 18, height: 50, border: 3, isStock: true, isPreset: false, createdAt: new Date(), updatedAt: new Date() },

        { outsideId: 47, name: 'Willow Leaf', sku: 'Wf1761', width: 17.125, height: 61, border: 3, isStock: true, isPreset: true, createdAt: new Date(), updatedAt: new Date() },
      ])
  },

  async down( queryInterface, Sequelize )
  {
    return queryInterface.bulkDelete( 'substrates', null, {} )
  }
}
