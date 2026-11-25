// Artful Home item number -> Artful Home's wholesale price for it: what
// Artful Home pays us, which their order emails don't carry, so
// parseArtfulHomeOrder() uses it as the line's unit price. Which Product
// an item number means is a Product Alias, not this table (see the
// 20261124000000-artful-home-product-aliases.js migration).
//
// Artful Home gives every design/size/colour its own item number
// ("P07859-P00152" is Golden Meadow, Small). Entries are the items on
// Artist Center's "Inventory & Turnaround Time" page as of 2026-11-16;
// each comment is Artful Home's title, variation and our "Artist Title"
// (in parentheses). Wholesale prices change - update them from that page
// when they do. A missing item leaves the line's price blank.
export const ARTFUL_HOME_WHOLESALE = {
  'P07859-P00001': 182.50, // Iris Drop Mosaic Mirror, Small (19in Iris Drop)
  'P07859-P00004': 375.00, // Golden Bronze Mosaic Mirror, Medium (22x28 Oval, Golden Bronze)
  'P07859-P00006': 237.50, // Butterfly Mirror, Small (18x22 Oval, Butterfly)
  'P07859-P00007': 375.00, // Teal Drop, Medium (22x28 Oval, Teal Drop)
  'P07859-P00018': 237.50, // Teal Drop, Small (18x22 Oval, Teal Drop)
  'P07859-P00019': 425.00, // Round Golden Bronze, Large (30in Golden Bronze)
  'P07859-P00020': 282.50, // Round Golden Bronze, Medium (24in Golden Bronze)
  'P07859-P00025': 425.00, // Seafoam Purple, Large (30in Seafoam Purple)
  'P07859-P00026': 282.50, // Seafoam Purple, Medium (24in Seafoam Purple)
  'P07859-P00028': 375.00, // Sangria, Medium (22x28 Oval, Sangria)
  'P07859-P00029': 237.50, // Sangria, Small (18x22 Oval, Sangria)
  'P07859-P00030': 450.00, // Sangria, Large (26x36 Oval, Sangria)
  'P07859-P00031': 282.50, // Seafoam Drop, Medium (24in Seafoam Drop)
  'P07859-P00032': 425.00, // Seafoam Drop, Large (30in Seafoam Drop)
  'P07859-P00034': 450.00, // Green Tea Leaf Mirror, Large
  'P07859-P00042': 450.00, // Cinnamon Sage Mirror, Large
  'P07859-P00043': 243.00, // Cinnamon Sage Mirror, Small
  'P07859-P00044': 243.00, // Sea Foam Leaf, Small
  'P07859-P00045': 450.00, // Sea Foam Leaf, Large
  'P07859-P00046': 400.00, // Mahogany Slate, Medium (24x28 Rectangle, Mahogany Slate)
  'P07859-P00047': 475.00, // Mahogany Slate, Large (30x30 Mahogany Slate)
  'P07859-P00048': 325.00, // Mahogany Slate, Small (18x27 Rectangle, Mahogany Slate)
  'P07859-P00065': 282.50, // Iris Flower Mirror, Medium (24in Iris Flower)
  'P07859-P00066': 425.00, // Iris Flower Mirror, Large (30in Iris Flower)
  'P07859-P00067': 282.50, // Pewter Drop Mirror, Medium (24in Pewter Drop)
  'P07859-P00068': 425.00, // Pewter Drop Mirror, Large (30in Pewter Drop)
  'P07859-P00073': 425.00, // Mina Gold
  'P07859-P00082': 425.00, // Mina Warm Gray
  'P07859-P00090': 243.00, // Jasmine Leaf Mirror, Small
  'P07859-P00091': 450.00, // Jasmine Leaf Mirror, Large
  'P07859-P00092': 282.50, // Iris Drop Mosaic Mirror, Medium (24in Iris Drop)
  'P07859-P00093': 425.00, // Iris Drop Mosaic Mirror, Large (30in iris Drop)
  'P07859-P00095': 182.50, // Seafoam Drop, Small (19in Seafoam Drop)
  'P07859-P00097': 182.50, // Round Golden Bronze, Small (19in Golden Bronze)
  'P07859-P00099': 450.00, // Teal Drop, Large (26x36 Oval, Teal Drop)
  'P07859-P00100': 237.50, // Golden Bronze Mosaic Mirror, Small (18x22 Oval, Golden Bronze)
  'P07859-P00101': 450.00, // Golden Bronze Mosaic Mirror, Large (26x36 Oval, Golden Bronze)
  'P07859-P00104': 375.00, // Butterfly Mirror, Medium (22x28 Oval, Butterfly)
  'P07859-P00105': 450.00, // Butterfly Mirror, Large (26x36 oval, Butterfly)
  'P07859-P00107': 800.00, // Clouds
  'P07859-P00111': 282.50, // Ebony Mirror, Medium (24in Ebony)
  'P07859-P00112': 182.50, // Ebony Mirror, Small (19in Ebony)
  'P07859-P00113': 425.00, // Ebony Mirror, Large (30in Ebony)
  'P07859-P00114': 182.50, // Frost Drop Mirror, Small (19in Frost Drop)
  'P07859-P00115': 282.50, // Frost Drop Mirror, Medium (24in Frost Drop)
  'P07859-P00116': 425.00, // Frost Drop Mirror, Large (30in Frost Drop)
  'P07859-P00117': 650.00, // Willow Leaf, Aquamarine
  'P07859-P00125': 750.00, // Ruby Sonora Mandala, Small (23in Sonora Mandala, Ruby)
  'P07859-P00126': 980.00, // Ruby Sonora Mandala, Medium (27in Sonora Mandala, Ruby)
  'P07859-P00127': 1250.00, // Ruby Sonora Mandala, Large (32in Sonora Mandala, Ruby)
  'P07859-P00128': 360.00, // Starlight Mandala, Lime Aqua, Small, Lime Aqua
  'P07859-P00129': 600.00, // Starlight Mandala, Lime Aqua, Medium, Lime Aqua
  'P07859-P00130': 360.00, // Starlight Mandala, Cotton Candy, Small, Cotton Candy
  'P07859-P00131': 600.00, // Starlight Mandala, Cotton Candy, Medium, Cotton Candy
  'P07859-P00132': 360.00, // Starlight Mandala, Capri Blue, Small, Capri Blue
  'P07859-P00133': 600.00, // Starlight Mandala, Capri Blue, Medium, Capri Blue
  'P07859-P00134': 600.00, // Starlight Mandala, Cocktail, Medium, Cocktail
  'P07859-P00135': 600.00, // Starlight Mandala, Plum, Medium, Plum
  'P07859-P00136': 600.00, // Starlight Mandala, Blush, Medium, Blush
  'P07859-P00137': 360.00, // Starlight Mandala, Blush, Small, Blush
  'P07859-P00138': 360.00, // Starlight Mandala, Plum, Small, Plum
  'P07859-P00139': 360.00, // Starlight Mandala, Cocktail, Small, Cocktail
  'P07859-P00144': 360.00, // Starlight Mandala, Sweet Fern, Small, Sweet Fern
  'P07859-P00145': 600.00, // Starlight Mandala, Sweet Fern, Medium, Sweet Fern
  'P07859-P00146': 360.00, // Starlight Mandala, Purple Haze, Small, Purple Haze
  'P07859-P00147': 600.00, // Starlight Mandala, Purple Haze, Medium, Purple Haze
  'P07859-P00148': 800.00, // Clouds, Seafoam
  'P07859-P00149': 600.00, // Starlight Mandala, Cobalt, Medium, Cobalt
  'P07859-P00151': 375.00, // Golden Meadow, Medium (22x28 Meadow)
  'P07859-P00152': 237.50, // Golden Meadow, Small (18x22 Golden Meadow)
  'P07859-P00153': 450.00, // Golden Meadow, Large (26x36 Golden Meadow)
  'P07859-P00154': 600.00, // Starlight Mandala, Pearl (26in Starlight Mandala, Pearl)
  'P07859-P00155': 800.00, // Clouds, Champagne Gold
  'P07859-P00156': 550.00, // Neslo Long Mirror, Golden Teal (18x50 Neslo, Golden Teal)
  'P07859-P00157': 550.00, // Neslo Long Mirror, Midnight Blue (18x50 Neslo, Midnight Blue)
  'P07859-P00165': 585.00, // Sage Cream Arch Mirror (24x36 Arch, Sage Cream)
  'P07859-P00166': 400.00, // Golden Chocolate, Medium (24x28 Golden Chocolate)
  'P07859-P00169': 585.00, // Cinnamon Sage Arch Mirror (24x36 Cinnamon Sage Arch)
  'P07859-P00174': 585.00, // Indigo Tide Arch Mirror (24x36 Indigo Tide Arch)
  'P07859-P00175': 400.00, // Seafoam Lace, Medium (24x28 Seafoam Lace)
  'P07859-P00176': 325.00, // Golden Teal Rectangle, Small
  'P07859-P00177': 475.00, // Golden Teal Rectangle, Large
  'P07859-P00178': 325.00, // Seafoam Lace, Small
  'P07859-P00179': 475.00, // Seafoam Lace, Large
  'P07859-P00180': 325.00, // Golden Chocolate, Small
  'P07859-P00181': 475.00, // Golden Chocolate, Large
}

export function artfulHomeWholesale( item )
{
  return ARTFUL_HOME_WHOLESALE[item?.trim()] ?? null
}
