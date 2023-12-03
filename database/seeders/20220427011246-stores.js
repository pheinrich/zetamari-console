module.exports =
{
  async up( queryInterface, Sequelize )
  {
    await queryInterface.bulkInsert( 'stores', [
      {
        name: 'Artful Home Catalog',
        url: 'https://www.artfulhome.com/',
        email: 'artists@artfulhome.com',
        phone: '(877) 256-6706',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Plum Bottom Pottery and Gallery',
        url: 'https://plumbottomgallery.com/',
        email: 'chad@plumbottomgallery.com',
        phone: '(719) 599-4565',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Yes! Gallery',
        url: 'https://www.facebook.com/JWGraham.YesGallery/',
        email: 'julie@jwgraham.com',
        phone: '(401) 295-0757',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Terrazza',
        url: 'https://terrazzagifts.com',
        email: 'contactus@terrazzahg.com',
        phone: '(508) 528-0977',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Arts Plus Gallery',
        url: 'https://www.artsplusgallery.com/',
        email: 'artsplusgallery@aol.com',
        phone: '(856) 854-5500',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Aladdin\'s Art Gallery',
        url: 'https://www.aladdinsart.com/',
        email: '',
        phone: '(606) 325-2597',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Steamboat Art Museum',
        url: 'https://steamboatartmuseum.org/',
        email: 'sam@steamboatartmuseum.org',
        phone: '(970) 870-1755',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'A Mano Galleries',
        url: 'https://www.amanogalleries.com/',
        email: 'amanog@verizon.net',
        phone: '(609) 397-0063',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Annie Kaill\'s',
        url: 'https://www.anniekaills.com/',
        email: 'colleen@anniekaills.com',
        phone: '(907) 586-2880',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Calgo Gardens',
        url: 'http://www.calgogardens.com',
        email: 'info@calgogardens.com',
        phone: '(732) 919-7770',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ] );
  },

  async down( queryInterface )
  {
    await queryInterface.bulkDelete( 'stores', null, {} );
  }
};
