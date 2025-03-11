'use strict'

module.exports =
{
  async up( queryInterface, Sequelize )
  {
    return queryInterface.bulkInsert(
      'Materials',
      [
        { id: 1, substrateInfoId: 1, name: '24"x36" Chapel Arch Substrate', type: 'substrate', sku: 'MSMCa2436', weight: -1 },
        { id: 2, substrateInfoId: 2, name: '45"x32" Cloud Substrate', type: 'substrate', sku: 'MSMCa4532', weight: -1 },

        { id: 3, substrateInfoId: 3, name: '7" Round Substrate', type: 'substrate', sku: 'MSMCi07', weight: -1 },
        { id: 4, substrateInfoId: 4, name: '10" Round Substrate', type: 'substrate', sku: 'MSMCi10', weight: -1 },
        { id: 5, substrateInfoId: 5, name: '13" Round Substrate', type: 'substrate', sku: 'MSMCi13', weight: -1 },
        { id: 6, substrateInfoId: 6, name: '17" Round Substrate', type: 'substrate', sku: 'MSMCi17', weight: -1 },
        { id: 7, substrateInfoId: 7, name: '19" Round Substrate', type: 'substrate', sku: 'MSMCi19', weight: -1 },
        { id: 8, substrateInfoId: 8, name: '24" Round Substrate', type: 'substrate', sku: 'MSMCi24', weight: -1 },
        { id: 9, substrateInfoId: 9, name: '30" Round Substrate', type: 'substrate', sku: 'MSMCi30', weight: -1 },
        { id: 10, substrateInfoId: 10, name: '36" Round Substrate', type: 'substrate', sku: 'MSMCi36', weight: -1 },

        { id: 11, substrateInfoId: 11, name: '16"x18" Small Leaf Substrate', type: 'substrate', sku: 'MSMLr1618', weight: -1 },
        { id: 12, substrateInfoId: 12, name: '22"x24" Medium Leaf Substrate', type: 'substrate', sku: 'MSMLr2224', weight: -1 },
        { id: 13, substrateInfoId: 13, name: '30"x33" Large Leaf Substrate', type: 'substrate', sku: 'MSMLr3033', weight: -1 },

        { id: 14, substrateInfoId: 14, name: '12"x15" Oval Substrate', type: 'substrate', sku: 'MSMOv1215', weight: -1 },
        { id: 15, substrateInfoId: 15, name: '14"x20" Oval Substrate', type: 'substrate', sku: 'MSMOv1420', weight: -1 },
        { id: 16, substrateInfoId: 16, name: '18"x22" Oval Substrate', type: 'substrate', sku: 'MSMOv1822', weight: -1 },
        { id: 17, substrateInfoId: 17, name: '22"x28" Oval Substrate', type: 'substrate', sku: 'MSMOv2228', weight: -1 },
        { id: 18, substrateInfoId: 18, name: '26"x36" Oval Substrate', type: 'substrate', sku: 'MSMOv2636', weight: -1 },

        { id: 19, substrateInfoId: 19, name: '21" Avens Mandala Substrate', type: 'substrate', sku: 'MSMMdAv21', weight: -1 },
        { id: 20, substrateInfoId: 20, name: '23" Planet Mandala', type: 'substrate', sku: 'MSMMdPl23', weight: -1 },
        { id: 21, substrateInfoId: 21, name: '23" Sonora Mandala Substrate', type: 'substrate', sku: 'MSMMdSn23', weight: -1 },
        { id: 22, substrateInfoId: 22, name: '7" Starlight Mandala Substrate', type: 'substrate', sku: 'MSMMdSl07', weight: -1 },
        { id: 23, substrateInfoId: 23, name: '10" Starlight Mandala Substrate', type: 'substrate', sku: 'MSMMdSl10', weight: -1 },
        { id: 24, substrateInfoId: 24, name: '14" Starlight Mandala Substrate', type: 'substrate', sku: 'MSMMdSl14', weight: -1 },
        { id: 25, substrateInfoId: 25, name: '21" Starlight Mandala Substrate', type: 'substrate', sku: 'MSMMdSl21', weight: -1 },
        { id: 26, substrateInfoId: 26, name: '26" Starlight Mandala Substrate', type: 'substrate', sku: 'MSMMdSl26', weight: -1 },

        { id: 27, substrateInfoId: 27, name: '24" Mina Substrate', type: 'substrate', sku: 'MSMMn24', weight: -1 },

        { id: 28, substrateInfoId: 28, name: '16"x36" Neslo Substrate', type: 'substrate', sku: 'MSMNe1636', weight: -1 },
        { id: 29, substrateInfoId: 29, name: '18"x50" Neslo Substrate', type: 'substrate', sku: 'MSMNe1850', weight: -1 },
        { id: 30, substrateInfoId: 30, name: '16"x36" Neslo Whimsy Substrate', type: 'substrate', sku: 'MSMNw1636', weight: -1 },
        { id: 31, substrateInfoId: 31, name: '18"x50" Neslo Whimsy Substrate', type: 'substrate', sku: 'MSMNw1850', weight: -1 },

        { id: 32, substrateInfoId: 32, name: '11"x18" Rectangular Substrate', type: 'substrate', sku: 'MSMRe1118', weight: -1 },
        { id: 33, substrateInfoId: 33, name: '14"x32" Rectangular Substrate', type: 'substrate', sku: 'MSMRe1432', weight: -1 },
        { id: 34, substrateInfoId: 34, name: '18"x27" Rectangular Substrate', type: 'substrate', sku: 'MSMRe1827', weight: -1 },
        { id: 35, substrateInfoId: 35, name: '18"x40" Rectangular Substrate', type: 'substrate', sku: 'MSMRe1840', weight: -1 },
        { id: 36, substrateInfoId: 36, name: '18"x48" Rectangular Substrate', type: 'substrate', sku: 'MSMRe1848', weight: -1 },
        { id: 37, substrateInfoId: 37, name: '24"x28" Rectangular Substrate', type: 'substrate', sku: 'MSMRe2428', weight: -1 },
        { id: 38, substrateInfoId: 38, name: '25"x36" Rectangular Substrate', type: 'substrate', sku: 'MSMRe2536', weight: -1 },

        { id: 39, substrateInfoId: 39, name: '12" Square Substrate', type: 'substrate', sku: 'MSMSq12', weight: -1 },
        { id: 40, substrateInfoId: 40, name: '24" Square Substrate', type: 'substrate', sku: 'MSMSq24', weight: -1 },
        { id: 41, substrateInfoId: 41, name: '30" Square Substrate', type: 'substrate', sku: 'MSMSq30', weight: -1 },

        { id: 42, substrateInfoId: 42, name: '17"x61" Willow Leaf Substrate', type: 'substrate', sku: 'MSMWf1761', weight: -1 },
     ])
  },

  async down( queryInterface, Sequelize )
  {
    return queryInterface.bulkDelete( 'Materials', null, {} )
  }
}
