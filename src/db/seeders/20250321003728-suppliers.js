'use strict';

module.exports =
{
  async up( queryInterface, Sequelize )
  {
    return queryInterface.bulkInsert(
      'Suppliers',
      [
        {
          id: 1,
          name: 'Zetamari',
          email: 'angie@zetamari.com',
          address: '503 N 62nd St, Seattle, WA 98103, USA',
          phone: '(206) 383-2698',
          url: 'https://www.zetamari.com/',
          notes: '',
        },
        {
          id: 2,
          name: 'Shipwreck Beads',
          email: 'info@shipwreckbeads.com',
          address: '8535 Commerce Pl Dr NE Ste A, Lacey, WA 98516, USA',
          phone: '(800) 950-4232',
          url: 'https://www.shipwreckbeads.com/',
          notes: 'Member#: NL0036297',
        },
        {
          id: 3,
          name: 'PandaHall (Ecworld Intl Ltd)',
          email: 'sales@pandahall.com',
          address: 'Rm 185 G/F Hang Wai Indl Ctr 6 Kin Tai St, Hong Kong',
          phone: '+86 18002503701',
          url: 'https://www.pandahall.com/',
          notes: '',
        },
        {
          id: 4,
          name: 'Hakatai Enterprises, Inc.',
          email: 'info@hakatai.com',
          address: '695 Mistletoe Rd Ste G, Ashland, OR 97520, USA',
          phone: '(888) 667-2429',
          url: 'https://www.hakatai.com/',
          notes: '',
        },
        {
          id: 5,
          name: 'Mosaic Trader',
          email: 'store@thecraftkit.com',
          address: 'Aalsmeerderweg 103B, Aalsmeer, The Netherlands, 1432CJ',
          phone: '+31 297 344 668',
          url: 'https://www.mosaictrader.com/',
          notes: '',
        },
        {
          id: 6,
          name: 'Starman',
          email: 'info@czechbeads.com',
          address: '96 E Idaho St, Eagle, ID 83616, USA',
          phone: '(888) 683-2323',
          url: 'https://www.czechbeads.com/',
          notes: '',
        },
        {
          id: 7,
          name: 'Harman',
          email: 'sales@harmanbeads.com',
          address: '95 Bi County Blvd, Farmingdale, NY 11735, USA',
          phone: '(631) 756-9800',
          url: 'https://www.harmanbeads.com/',
          notes: '',
        },
        {
          id: 8,
          name: 'Raven\'s Journey',
          email: 'sales@ravensjourney.com',
          address: '',
          phone: '(206) 595-5158',
          url: 'https://www.ravensjourney.com/',
          notes: '',
        },
        {
          id: 9,
          name: 'Artful Crafter',
          email: 'info@mosaictileusa.com',
          address: '6635 W Happy Valley Rd Ste A104-454, Glendale, AZ 85310, USA',
          phone: '(877) 321-2080',
          url: 'http://www.mosaictileusa.com/',
          notes: 'aka Mosaic Tile USA',
        },
        {
          id: 10,
          name: 'Mosaic Art Supply',
          email: 'help@mosaicartsupply.com',
          address: '2964 Alcove Dr, Scottdale, GA 30079, USA',
          phone: '(404) 371-4070',
          url: 'https://mosaicartsupply.com/',
          notes: '',
        },
        {
          id: 11,
          name: 'Dunn Lumber',
          email: 'credit@dunnlumber.com',
          address: '10411 Airport Rd Ste 102, Everett, WA 98204, USA',
          phone: '(800) 248-3866',
          url: 'https://www.dunnlumber.com/',
          notes: '',
        },
        {
          id: 12,
          name: 'Gets',
          email: 'sales@gets.com',
          address: '20th Floor JinSheng Building, No. 128 FengYuan Road Liwan District, Guangzhou City, Guangdong Province, China, 510170',
          phone: '+86 158 0201 5774',
          url: 'https://www.gets.com/',
          notes: '',
        },
        {
          id: 13,
          name: 'PixieTiles',
          email: '',
          address: '',
          phone: '',
          url: 'https://pixietiles.etsy.com/',
          notes: 'Owner: Shannon Cunningham',
        },
        {
          id: 14,
          name: 'Kismet Mosaic',
          email: 'info@kismetmosaic.com',
          address: '',
          phone: '(719) 354-4671',
          url: 'https://www.kismetmosaic.com/',
          notes: '',
        },
      ])
  },

  async down( queryInterface, Sequelize )
  {
    return queryInterface.bulkDelete( 'Suppliers', null, {} )
  }
}
