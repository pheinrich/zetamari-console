// Artful Home item number -> our SKU and Artful Home's wholesale price,
// used by parseArtfulHomeOrder().
//
// Artful Home gives every design/size/colour its own item number
// ("P07859-P00152" is Golden Meadow, Small), so this is a flat lookup.
// `wholesale` is what Artful Home pays us for the item - their order
// emails carry no prices, so it becomes the line's unit price. A null
// `sku` (or a missing entry) leaves the line unmatched, keeping Artful
// Home's item number as its SKU for someone to resolve at review.
//
// Entries are the 84 items on Artist Center's "Inventory & Turnaround
// Time" page as of 2026-11-16. Each comment is Artful Home's title,
// variation and our "Artist Title" (in parentheses). SKUs are filled in
// only where the same design at the same size is a SKU on Faire; where
// a SKU is likely but unconfirmed it's suggested in the comment instead,
// for a person to check and fill in. Wholesale prices change - update
// them from that page when they do.
export const ARTFUL_HOME_ITEMS = {
  'P07859-P00001': {sku: 'ZMCi19-IrisDp', wholesale: 182.50}, // Iris Drop Mosaic Mirror, Small (19in Iris Drop)
  'P07859-P00004': {sku: 'ZMOv2228-GoldenBronze', wholesale: 375.00}, // Golden Bronze Mosaic Mirror, Medium (22x28 Oval, Golden Bronze)
  'P07859-P00006': {sku: 'ZMOv1822-Butterfly', wholesale: 237.50}, // Butterfly Mirror, Small (18x22 Oval, Butterfly)
  'P07859-P00007': {sku: null, wholesale: 375.00}, // Teal Drop, Medium (22x28 Oval, Teal Drop) - no Teal Drop on Faire
  'P07859-P00018': {sku: null, wholesale: 237.50}, // Teal Drop, Small (18x22 Oval, Teal Drop) - no Teal Drop on Faire
  'P07859-P00019': {sku: 'ZMCi30-GoldenBronze', wholesale: 425.00}, // Round Golden Bronze, Large (30in Golden Bronze)
  'P07859-P00020': {sku: 'ZMCi24-GoldenBronze', wholesale: 282.50}, // Round Golden Bronze, Medium (24in Golden Bronze)
  'P07859-P00025': {sku: null, wholesale: 425.00}, // Seafoam Purple, Large (30in Seafoam Purple) - ZMCi30-PurpleDp? (Faire: "Purple Drop")
  'P07859-P00026': {sku: null, wholesale: 282.50}, // Seafoam Purple, Medium (24in Seafoam Purple) - ZMCi24-PurpleDp? (Faire: "Purple Drop")
  'P07859-P00028': {sku: null, wholesale: 375.00}, // Sangria, Medium (22x28 Oval, Sangria) - Sangria only rect/square on Faire
  'P07859-P00029': {sku: null, wholesale: 237.50}, // Sangria, Small (18x22 Oval, Sangria) - Sangria only rect/square on Faire
  'P07859-P00030': {sku: null, wholesale: 450.00}, // Sangria, Large (26x36 Oval, Sangria) - Sangria only rect/square on Faire
  'P07859-P00031': {sku: 'ZMCi24-SeafoamDrop', wholesale: 282.50}, // Seafoam Drop, Medium (24in Seafoam Drop)
  'P07859-P00032': {sku: 'ZMCi30-SeafoamDrop', wholesale: 425.00}, // Seafoam Drop, Large (30in Seafoam Drop)
  'P07859-P00034': {sku: 'ZMLr3033-GreenTea', wholesale: 450.00}, // Green Tea Leaf Mirror, Large
  'P07859-P00042': {sku: 'ZMLr3033-CinnamonSage', wholesale: 450.00}, // Cinnamon Sage Mirror, Large
  'P07859-P00043': {sku: null, wholesale: 243.00}, // Cinnamon Sage Mirror, Small - ZMLr2224-CinnamonSage? (AH Small $243 ~ Faire 22x24 $250)
  'P07859-P00044': {sku: null, wholesale: 243.00}, // Sea Foam Leaf, Small - ZMLr2224-Seafoam? (AH Small $243 ~ Faire 22x24 $250)
  'P07859-P00045': {sku: 'ZMLr3033-Seafoam', wholesale: 450.00}, // Sea Foam Leaf, Large
  'P07859-P00046': {sku: null, wholesale: 400.00}, // Mahogany Slate, Medium (24x28 Rectangle, Mahogany Slate) - ZMRe2428-MahoganyBronze? (Faire: "Mahogany Bronze")
  'P07859-P00047': {sku: null, wholesale: 475.00}, // Mahogany Slate, Large (30x30 Mahogany Slate) - no 30x30 on Faire
  'P07859-P00048': {sku: null, wholesale: 325.00}, // Mahogany Slate, Small (18x27 Rectangle, Mahogany Slate) - ZMRe1827-MahoganyBronze? (Faire: "Mahogany Bronze")
  'P07859-P00065': {sku: null, wholesale: 282.50}, // Iris Flower Mirror, Medium (24in Iris Flower) - ZMCi24-IrisYellow? (Faire: "Iris Yellow")
  'P07859-P00066': {sku: null, wholesale: 425.00}, // Iris Flower Mirror, Large (30in Iris Flower) - ZMCi30-IrisYellow? (Faire: "Iris Yellow")
  'P07859-P00067': {sku: 'ZMCi24-PewterDp', wholesale: 282.50}, // Pewter Drop Mirror, Medium (24in Pewter Drop)
  'P07859-P00068': {sku: 'ZMCi30-PewterDp', wholesale: 425.00}, // Pewter Drop Mirror, Large (30in Pewter Drop)
  'P07859-P00073': {sku: null, wholesale: 425.00}, // Mina Gold
  'P07859-P00082': {sku: null, wholesale: 425.00}, // Mina Warm Gray
  'P07859-P00090': {sku: null, wholesale: 243.00}, // Jasmine Leaf Mirror, Small - ZMLr2224-Jasmine? (AH Small $243 ~ Faire 22x24 $250)
  'P07859-P00091': {sku: 'ZMLr3033-Jasmine', wholesale: 450.00}, // Jasmine Leaf Mirror, Large
  'P07859-P00092': {sku: 'ZMCi24-IrisDp', wholesale: 282.50}, // Iris Drop Mosaic Mirror, Medium (24in Iris Drop)
  'P07859-P00093': {sku: 'ZMCi30-IrisDp', wholesale: 425.00}, // Iris Drop Mosaic Mirror, Large (30in iris Drop)
  'P07859-P00095': {sku: 'ZMCi19-SeafoamDrop', wholesale: 182.50}, // Seafoam Drop, Small (19in Seafoam Drop)
  'P07859-P00097': {sku: 'ZMCi19-GoldenBronze', wholesale: 182.50}, // Round Golden Bronze, Small (19in Golden Bronze)
  'P07859-P00099': {sku: null, wholesale: 450.00}, // Teal Drop, Large (26x36 Oval, Teal Drop) - no Teal Drop on Faire
  'P07859-P00100': {sku: 'ZMOv1822-GoldenBronze', wholesale: 237.50}, // Golden Bronze Mosaic Mirror, Small (18x22 Oval, Golden Bronze)
  'P07859-P00101': {sku: null, wholesale: 450.00}, // Golden Bronze Mosaic Mirror, Large (26x36 Oval, Golden Bronze) - ZMOv2636-GoldenBronze? (not on Faire)
  'P07859-P00104': {sku: 'ZMOv2228-Butterfly', wholesale: 375.00}, // Butterfly Mirror, Medium (22x28 Oval, Butterfly)
  'P07859-P00105': {sku: null, wholesale: 450.00}, // Butterfly Mirror, Large (26x36 oval, Butterfly) - ZMOv2636-Butterfly? (not on Faire)
  'P07859-P00107': {sku: null, wholesale: 800.00}, // Clouds
  'P07859-P00111': {sku: null, wholesale: 282.50}, // Ebony Mirror, Medium (24in Ebony)
  'P07859-P00112': {sku: null, wholesale: 182.50}, // Ebony Mirror, Small (19in Ebony)
  'P07859-P00113': {sku: null, wholesale: 425.00}, // Ebony Mirror, Large (30in Ebony)
  'P07859-P00114': {sku: null, wholesale: 182.50}, // Frost Drop Mirror, Small (19in Frost Drop) - Faire has only 10in Frost Drop
  'P07859-P00115': {sku: null, wholesale: 282.50}, // Frost Drop Mirror, Medium (24in Frost Drop) - Faire has only 10in Frost Drop
  'P07859-P00116': {sku: null, wholesale: 425.00}, // Frost Drop Mirror, Large (30in Frost Drop) - Faire has only 10in Frost Drop
  'P07859-P00117': {sku: null, wholesale: 650.00}, // Willow Leaf, Aquamarine - ZMWf1761-Special? (Faire custom Willow Mirror, $650)
  'P07859-P00125': {sku: null, wholesale: 750.00}, // Ruby Sonora Mandala, Small (23in Sonora Mandala, Ruby)
  'P07859-P00126': {sku: null, wholesale: 980.00}, // Ruby Sonora Mandala, Medium (27in Sonora Mandala, Ruby)
  'P07859-P00127': {sku: null, wholesale: 1250.00}, // Ruby Sonora Mandala, Large (32in Sonora Mandala, Ruby)
  'P07859-P00128': {sku: null, wholesale: 360.00}, // Starlight Mandala, Lime Aqua, Small, Lime Aqua - ZMMdSl21-LimeAqua?
  'P07859-P00129': {sku: null, wholesale: 600.00}, // Starlight Mandala, Lime Aqua, Medium, Lime Aqua - ZMMdSl26-LimeAqua?
  'P07859-P00130': {sku: null, wholesale: 360.00}, // Starlight Mandala, Cotton Candy, Small, Cotton Candy - ZMMdSl21-CottonCandy?
  'P07859-P00131': {sku: null, wholesale: 600.00}, // Starlight Mandala, Cotton Candy, Medium, Cotton Candy - ZMMdSl26-CottonCandy?
  'P07859-P00132': {sku: 'ZMMdSl21-CapriBlue', wholesale: 360.00}, // Starlight Mandala, Capri Blue, Small, Capri Blue
  'P07859-P00133': {sku: null, wholesale: 600.00}, // Starlight Mandala, Capri Blue, Medium, Capri Blue - ZMMdSl26-CapriBlue?
  'P07859-P00134': {sku: null, wholesale: 600.00}, // Starlight Mandala, Cocktail, Medium, Cocktail - ZMMdSl26-Cocktail?
  'P07859-P00135': {sku: null, wholesale: 600.00}, // Starlight Mandala, Plum, Medium, Plum - ZMMdSl26-Plum?
  'P07859-P00136': {sku: null, wholesale: 600.00}, // Starlight Mandala, Blush, Medium, Blush - ZMMdSl26-Blush?
  'P07859-P00137': {sku: null, wholesale: 360.00}, // Starlight Mandala, Blush, Small, Blush - ZMMdSl21-Blush?
  'P07859-P00138': {sku: 'ZMMdSl21-Plum', wholesale: 360.00}, // Starlight Mandala, Plum, Small, Plum
  'P07859-P00139': {sku: null, wholesale: 360.00}, // Starlight Mandala, Cocktail, Small, Cocktail - ZMMdSl21-Cocktail?
  'P07859-P00144': {sku: null, wholesale: 360.00}, // Starlight Mandala, Sweet Fern, Small, Sweet Fern - ZMMdSl21-SweetFern?
  'P07859-P00145': {sku: null, wholesale: 600.00}, // Starlight Mandala, Sweet Fern, Medium, Sweet Fern - ZMMdSl26-SweetFern?
  'P07859-P00146': {sku: null, wholesale: 360.00}, // Starlight Mandala, Purple Haze, Small, Purple Haze - ZMMdSl21-PurpleHaze?
  'P07859-P00147': {sku: null, wholesale: 600.00}, // Starlight Mandala, Purple Haze, Medium, Purple Haze - ZMMdSl26-PurpleHaze?
  'P07859-P00148': {sku: null, wholesale: 800.00}, // Clouds, Seafoam
  'P07859-P00149': {sku: null, wholesale: 600.00}, // Starlight Mandala, Cobalt, Medium, Cobalt - ZMMdSl26-Cobalt? (Faire has only 21in Cobalt)
  'P07859-P00151': {sku: null, wholesale: 375.00}, // Golden Meadow, Medium (22x28 Meadow)
  'P07859-P00152': {sku: null, wholesale: 237.50}, // Golden Meadow, Small (18x22 Golden Meadow)
  'P07859-P00153': {sku: null, wholesale: 450.00}, // Golden Meadow, Large (26x36 Golden Meadow)
  'P07859-P00154': {sku: null, wholesale: 600.00}, // Starlight Mandala, Pearl (26in Starlight Mandala, Pearl) - ZMMdSl26-Pearl?
  'P07859-P00155': {sku: null, wholesale: 800.00}, // Clouds, Champagne Gold
  'P07859-P00156': {sku: null, wholesale: 550.00}, // Neslo Long Mirror, Golden Teal (18x50 Neslo, Golden Teal) - ZMNe1850-Special? (Faire custom Neslo, $550)
  'P07859-P00157': {sku: null, wholesale: 550.00}, // Neslo Long Mirror, Midnight Blue (18x50 Neslo, Midnight Blue) - ZMNe1850-Special? (Faire custom Neslo, $550)
  'P07859-P00165': {sku: 'ZMCa2436-SageCream', wholesale: 585.00}, // Sage Cream Arch Mirror (24x36 Arch, Sage Cream)
  'P07859-P00166': {sku: 'ZMRe2428-GoldenChoc', wholesale: 400.00}, // Golden Chocolate, Medium (24x28 Golden Chocolate)
  'P07859-P00169': {sku: null, wholesale: 585.00}, // Cinnamon Sage Arch Mirror (24x36 Cinnamon Sage Arch) - ZMCa2436-CinnamonSage?
  'P07859-P00174': {sku: null, wholesale: 585.00}, // Indigo Tide Arch Mirror (24x36 Indigo Tide Arch)
  'P07859-P00175': {sku: null, wholesale: 400.00}, // Seafoam Lace, Medium (24x28 Seafoam Lace)
  'P07859-P00178': {sku: null, wholesale: 325.00}, // Seafoam Lace, Small
  'P07859-P00179': {sku: null, wholesale: 475.00}, // Seafoam Lace, Large
  'P07859-P00180': {sku: null, wholesale: 325.00}, // Golden Chocolate, Small - ZMRe1827-GoldenChoc? (AH Small $325 = Mahogany Slate 18x27)
  'P07859-P00181': {sku: null, wholesale: 475.00}, // Golden Chocolate, Large - no 30x30 on Faire
}

// -> {sku, wholesale} for an Artful Home item number (either may be
// null), or null for an item not in the table.
export function artfulHomeItem( item )
{
  return ARTFUL_HOME_ITEMS[item?.trim()] ?? null
}
