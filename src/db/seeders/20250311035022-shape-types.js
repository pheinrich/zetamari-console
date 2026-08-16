'use strict'

// Seeds ShapeTypes from a phpMyAdmin dump of the live `zetamari_prod`
// database (ShapeTypes.sql, Aug 15 2026), rather than from the dynamic
// "derive shape families from whatever Contours already exist" logic
// 20260715000000-shape-types.js's migration used to use to populate this
// table. That logic is data-dependent - a fresh dev/test database ends
// up with different ShapeTypes ids (and possibly different custom-shape
// rows entirely, since it derives them from Contours present at
// migration time) than production actually has. This seeder instead
// reproduces production's exact ids/names/keys so a freshly-seeded
// environment's ShapeTypes match what any real Contour/Product data
// expects to reference by id - including this project's own
// 20250311035023-contours.js seeder, whose rows point at these ids via
// shapeTypeId (a NOT NULL foreign key - see that migration).
//
// Timestamped to run right after 20250311035021-products.js and right
// before 20250311035023-contours.js (sequelize-cli runs seeders in
// filename order), despite being written and added much later - two
// separate NOT NULL/foreign-key dependencies pull in opposite
// directions: Contours.shapeTypeId needs ShapeTypes populated first, but
// ShapeTypes.prototypeWoodenBaseId (see below) needs Products populated
// first. This is the one ordering that satisfies both.
//
// key is only set for the 7 shapes buildFromType() (@/libs/mirror) can
// draw parametrically from width/height alone - null for the rest
// (custom/traced shapes), matching the model's own doc comment.
//
// description is NULL for every row in the source dump, so it's omitted
// here rather than seeded as an explicit null.
//
// prototypeWoodenBaseId points at the Products row that seeds a
// brand-new shape of that family from the Visualizer's "New" dropdown
// (see ShapeType.js's doc comment), and is itself a foreign key into
// Products - production's dump has it set for all 7 parametric shapes,
// but 20250311035021-products.js's dev catalog only goes up to id 50, so
// the two values that fall outside that range (58 for Chapel Arch, 59
// for Vesica Piscis) are left null here rather than left in and failing
// the foreign-key constraint - the other 5 (6, 16, 21, 39, 46) do exist
// in the dev catalog and match the expected wooden-base product by name
// (e.g. 6 = '17" Round Wooden Base' for Circle), so those are kept as-is.
module.exports =
{
  async up( queryInterface, Sequelize )
  {
    return queryInterface.bulkInsert( 'ShapeTypes', [
      { id: 1, name: 'Chapel Arch', key: 'chapel arch' },
      { id: 2, name: 'Circle', key: 'circle', prototypeWoodenBaseId: 6 },
      { id: 3, name: 'Gothic Arch', key: 'gothic arch', prototypeWoodenBaseId: 16 },
      { id: 4, name: 'Oval', key: 'oval', prototypeWoodenBaseId: 21 },
      { id: 5, name: 'Rectangle', key: 'rectangle', prototypeWoodenBaseId: 39 },
      { id: 6, name: 'Square', key: 'square', prototypeWoodenBaseId: 46 },
      { id: 7, name: 'Vesica Piscis', key: 'vesica piscis' },
      { id: 12, name: 'Cora' },
      { id: 15, name: 'Leaf' },
      { id: 16, name: 'Mandala (Avens)' },
      { id: 17, name: 'Mandala (Planet)' },
      { id: 18, name: 'Mandala (Sonora)' },
      { id: 22, name: 'Mandala (Starlight)' },
      { id: 23, name: 'Mina' },
      { id: 24, name: 'Neslo' },
      { id: 25, name: 'Neslo Whimsy' },
      { id: 26, name: 'Willow Leaf' },
    ] )
  },

  async down( queryInterface, Sequelize )
  {
    return queryInterface.bulkDelete( 'ShapeTypes', null, {} )
  }
}
