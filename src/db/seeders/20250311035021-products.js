'use strict'

module.exports =
{
  async up( queryInterface, Sequelize )
  {
    return queryInterface.bulkInsert(
      'Products',
      [
        { id: 1, name: '24"x36" Chapel Arch Wooden Base', type: 'wooden base', sku: 'MSMCa2436', weight: -1 },
        { id: 2, name: '45"x32" Cloud Wooden Base', type: 'wooden base', sku: 'MSMCa4532', weight: -1 },

        { id: 3, name: '7" Round Wooden Base', type: 'wooden base', sku: 'MSMCi07', weight: -1 },
        { id: 4, name: '10" Round Wooden Base', type: 'wooden base', sku: 'MSMCi10', weight: -1 },
        { id: 5, name: '13" Round Wooden Base', type: 'wooden base', sku: 'MSMCi13', weight: -1 },
        { id: 6, name: '17" Round Wooden Base', type: 'wooden base', sku: 'MSMCi17', weight: -1 },
        { id: 7, name: '19" Round Wooden Base', type: 'wooden base', sku: 'MSMCi19', weight: -1 },
        { id: 8, name: '24" Round Wooden Base', type: 'wooden base', sku: 'MSMCi24', weight: -1 },
        { id: 9, name: '30" Round Wooden Base', type: 'wooden base', sku: 'MSMCi30', weight: -1 },
        { id: 10, name: '36" Round Wooden Base', type: 'wooden base', sku: 'MSMCi36', weight: -1 },

        { id: 11, name: '8"x18" Cora Wooden Base', type: 'wooden base', sku: 'MSMCr818', weight: -1 },
        { id: 12, name: '10"x24" Cora Wooden Base', type: 'wooden base', sku: 'MSMCr1024', weight: -1 },
        { id: 13, name: '14"x24" Cora Wooden Base', type: 'wooden base', sku: 'MSMCr1424', weight: -1 },
        { id: 14, name: '34"x24" Cora Wooden Base', type: 'wooden base', sku: 'MSMCr3424', weight: -1 },
        { id: 15, name: '44"x31" Cora Wooden Base', type: 'wooden base', sku: 'MSMCr4431', weight: -1 },

        { id: 16, name: '10"x16" Gothic Arch Wooden Base', type: 'wooden base', sku: 'MSMGa1016', weight: -1 },

        { id: 17, name: '16"x18" Small Leaf Wooden Base', type: 'wooden base', sku: 'MSMLr1618', weight: -1 },
        { id: 18, name: '22"x24" Medium Leaf Wooden Base', type: 'wooden base', sku: 'MSMLr2224', weight: -1 },
        { id: 19, name: '30"x33" Large Leaf Wooden Base', type: 'wooden base', sku: 'MSMLr3033', weight: -1 },

        { id: 20, name: '12"x15" Oval Wooden Base', type: 'wooden base', sku: 'MSMOv1215', weight: -1 },
        { id: 21, name: '14"x20" Oval Wooden Base', type: 'wooden base', sku: 'MSMOv1420', weight: -1 },
        { id: 22, name: '18"x22" Oval Wooden Base', type: 'wooden base', sku: 'MSMOv1822', weight: -1 },
        { id: 23, name: '22"x28" Oval Wooden Base', type: 'wooden base', sku: 'MSMOv2228', weight: -1 },
        { id: 24, name: '22"x34" Oval Wooden Base', type: 'wooden base', sku: 'MSMOv2234', weight: -1 },
        { id: 25, name: '26"x36" Oval Wooden Base', type: 'wooden base', sku: 'MSMOv2636', weight: -1 },

        { id: 26, name: '21" Avens Mandala Wooden Base', type: 'wooden base', sku: 'MSMMdAv21', weight: -1 },
        { id: 27, name: '23" Planet Mandala Wooden Base', type: 'wooden base', sku: 'MSMMdPl23', weight: -1 },
        { id: 28, name: '23" Sonora Mandala Wooden Base', type: 'wooden base', sku: 'MSMMdSn23', weight: -1 },
        { id: 29, name: '7" Starlight Mandala Wooden Base', type: 'wooden base', sku: 'MSMMdSl07', weight: -1 },
        { id: 30, name: '10" Starlight Mandala Wooden Base', type: 'wooden base', sku: 'MSMMdSl10', weight: -1 },
        { id: 31, name: '14" Starlight Mandala Wooden Base', type: 'wooden base', sku: 'MSMMdSl14', weight: -1 },
        { id: 32, name: '21" Starlight Mandala Wooden Base', type: 'wooden base', sku: 'MSMMdSl21', weight: -1 },
        { id: 33, name: '26" Starlight Mandala Wooden Base', type: 'wooden base', sku: 'MSMMdSl26', weight: -1 },

        { id: 34, name: '24" Mina Wooden Base', type: 'wooden base', sku: 'MSMMn24', weight: -1 },

        { id: 35, name: '16"x36" Neslo Wooden Base', type: 'wooden base', sku: 'MSMNe1636', weight: -1 },
        { id: 36, name: '18"x50" Neslo Wooden Base', type: 'wooden base', sku: 'MSMNe1850', weight: -1 },
        { id: 37, name: '16"x36" Neslo Whimsy Wooden Base', type: 'wooden base', sku: 'MSMNw1636', weight: -1 },
        { id: 38, name: '18"x50" Neslo Whimsy Wooden Base', type: 'wooden base', sku: 'MSMNw1850', weight: -1 },

        { id: 39, name: '11"x18" Rectangular Wooden Base', type: 'wooden base', sku: 'MSMRe1118', weight: -1 },
        { id: 40, name: '14"x32" Rectangular Wooden Base', type: 'wooden base', sku: 'MSMRe1432', weight: -1 },
        { id: 41, name: '18"x27" Rectangular Wooden Base', type: 'wooden base', sku: 'MSMRe1827', weight: -1 },
        { id: 42, name: '18"x40" Rectangular Wooden Base', type: 'wooden base', sku: 'MSMRe1840', weight: -1 },
        { id: 43, name: '18"x48" Rectangular Wooden Base', type: 'wooden base', sku: 'MSMRe1848', weight: -1 },
        { id: 44, name: '24"x28" Rectangular Wooden Base', type: 'wooden base', sku: 'MSMRe2428', weight: -1 },
        { id: 45, name: '25"x36" Rectangular Wooden Base', type: 'wooden base', sku: 'MSMRe2536', weight: -1 },

        { id: 46, name: '12" Square Wooden Base', type: 'wooden base', sku: 'MSMSq12', weight: -1 },
        { id: 47, name: '24" Square Wooden Base', type: 'wooden base', sku: 'MSMSq24', weight: -1 },
        { id: 48, name: '30" Square Wooden Base', type: 'wooden base', sku: 'MSMSq30', weight: -1 },

        { id: 49, name: '17"x61" Willow Leaf Wooden Base', type: 'wooden base', sku: 'MSMWf1761', weight: -1 },

        { id: 50, name: '4mm Round, Opaque White', type: 'bead', sku: '', weight: -1 },
      ])
  },

  async down( queryInterface, Sequelize )
  {
    return queryInterface.bulkDelete( 'Products', null, {} )
  }
}
