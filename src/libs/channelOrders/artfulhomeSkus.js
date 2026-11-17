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
  'P07859-P00007': {sku: 'ZMOv2228-TealDp', wholesale: 375.00}, // Teal Drop, Medium (22x28 Oval, Teal Drop)
  'P07859-P00018': {sku: 'ZMOv1822-TealDp', wholesale: 237.50}, // Teal Drop, Small (18x22 Oval, Teal Drop)
  'P07859-P00019': {sku: 'ZMCi30-GoldenBronze', wholesale: 425.00}, // Round Golden Bronze, Large (30in Golden Bronze)
  'P07859-P00020': {sku: 'ZMCi24-GoldenBronze', wholesale: 282.50}, // Round Golden Bronze, Medium (24in Golden Bronze)
  'P07859-P00025': {sku: 'ZMCi30-SeafoamPurple', wholesale: 425.00}, // Seafoam Purple, Large (30in Seafoam Purple)
  'P07859-P00026': {sku: 'ZMCi24-SeafoamPurple', wholesale: 282.50}, // Seafoam Purple, Medium (24in Seafoam Purple)
  'P07859-P00028': {sku: 'ZMOv2228-Sangria', wholesale: 375.00}, // Sangria, Medium (22x28 Oval, Sangria)
  'P07859-P00029': {sku: 'ZMOv1822-Sangria', wholesale: 237.50}, // Sangria, Small (18x22 Oval, Sangria)
  'P07859-P00030': {sku: 'ZMOv2636-Sangria', wholesale: 450.00}, // Sangria, Large (26x36 Oval, Sangria)
  'P07859-P00031': {sku: 'ZMCi24-SeafoamDp', wholesale: 282.50}, // Seafoam Drop, Medium (24in Seafoam Drop)
  'P07859-P00032': {sku: 'ZMCi30-SeafoamDp', wholesale: 425.00}, // Seafoam Drop, Large (30in Seafoam Drop)
  'P07859-P00034': {sku: 'ZMLr3033-GreenTea', wholesale: 450.00}, // Green Tea Leaf Mirror, Large
  'P07859-P00042': {sku: 'ZMLr3033-CinnamonSage', wholesale: 450.00}, // Cinnamon Sage Mirror, Large
  'P07859-P00043': {sku: 'ZMLr2224-CinnamonSage', wholesale: 243.00}, // Cinnamon Sage Mirror, Small
  'P07859-P00044': {sku: 'ZMLr2224-Seafoam', wholesale: 243.00}, // Sea Foam Leaf, Small
  'P07859-P00045': {sku: 'ZMLr3033-Seafoam', wholesale: 450.00}, // Sea Foam Leaf, Large
  'P07859-P00046': {sku: 'ZMRe2428-MahoganySlate', wholesale: 400.00}, // Mahogany Slate, Medium (24x28 Rectangle, Mahogany Slate)
  'P07859-P00047': {sku: 'ZMSq30-MahoganySlate', wholesale: 475.00}, // Mahogany Slate, Large (30x30 Mahogany Slate)
  'P07859-P00048': {sku: 'ZMRe1827-MahoganySlate', wholesale: 325.00}, // Mahogany Slate, Small (18x27 Rectangle, Mahogany Slate)
  'P07859-P00065': {sku: 'ZMCi24-IrisFl', wholesale: 282.50}, // Iris Flower Mirror, Medium (24in Iris Flower)
  'P07859-P00066': {sku: 'ZMCi30-IrisFl', wholesale: 425.00}, // Iris Flower Mirror, Large (30in Iris Flower)
  'P07859-P00067': {sku: 'ZMCi24-PewterDp', wholesale: 282.50}, // Pewter Drop Mirror, Medium (24in Pewter Drop)
  'P07859-P00068': {sku: 'ZMCi30-PewterDp', wholesale: 425.00}, // Pewter Drop Mirror, Large (30in Pewter Drop)
  'P07859-P00073': {sku: 'ZMMn24-Gold', wholesale: 425.00}, // Mina Gold
  'P07859-P00082': {sku: 'ZMMn24-WarmGrey', wholesale: 425.00}, // Mina Warm Gray
  'P07859-P00090': {sku: 'ZMLr2224-Jasmine', wholesale: 243.00}, // Jasmine Leaf Mirror, Small
  'P07859-P00091': {sku: 'ZMLr3033-Jasmine', wholesale: 450.00}, // Jasmine Leaf Mirror, Large
  'P07859-P00092': {sku: 'ZMCi24-IrisDp', wholesale: 282.50}, // Iris Drop Mosaic Mirror, Medium (24in Iris Drop)
  'P07859-P00093': {sku: 'ZMCi30-IrisDp', wholesale: 425.00}, // Iris Drop Mosaic Mirror, Large (30in iris Drop)
  'P07859-P00095': {sku: 'ZMCi19-SeafoamDp', wholesale: 182.50}, // Seafoam Drop, Small (19in Seafoam Drop)
  'P07859-P00097': {sku: 'ZMCi19-GoldenBronze', wholesale: 182.50}, // Round Golden Bronze, Small (19in Golden Bronze)
  'P07859-P00099': {sku: 'ZMOv2636-TealDp', wholesale: 450.00}, // Teal Drop, Large (26x36 Oval, Teal Drop)
  'P07859-P00100': {sku: 'ZMOv1822-GoldenBronze', wholesale: 237.50}, // Golden Bronze Mosaic Mirror, Small (18x22 Oval, Golden Bronze)
  'P07859-P00101': {sku: 'ZMOv2636-GoldenBronze', wholesale: 450.00}, // Golden Bronze Mosaic Mirror, Large (26x36 Oval, Golden Bronze)
  'P07859-P00104': {sku: 'ZMOv2228-Butterfly', wholesale: 375.00}, // Butterfly Mirror, Medium (22x28 Oval, Butterfly)
  'P07859-P00105': {sku: 'ZMOv2636-Butterfly', wholesale: 450.00}, // Butterfly Mirror, Large (26x36 oval, Butterfly)
  'P07859-P00107': {sku: 'ZMCd4532', wholesale: 800.00}, // Clouds
  'P07859-P00111': {sku: 'ZMCi24-Ebony', wholesale: 282.50}, // Ebony Mirror, Medium (24in Ebony)
  'P07859-P00112': {sku: 'ZMCi19-Ebony', wholesale: 182.50}, // Ebony Mirror, Small (19in Ebony)
  'P07859-P00113': {sku: 'ZMCi30-Ebony', wholesale: 425.00}, // Ebony Mirror, Large (30in Ebony)
  'P07859-P00114': {sku: 'ZMCi19-FrostDp', wholesale: 182.50}, // Frost Drop Mirror, Small (19in Frost Drop)
  'P07859-P00115': {sku: 'ZMCi24-FrostDp', wholesale: 282.50}, // Frost Drop Mirror, Medium (24in Frost Drop)
  'P07859-P00116': {sku: 'ZMCi30-FrostDp', wholesale: 425.00}, // Frost Drop Mirror, Large (30in Frost Drop)
  'P07859-P00117': {sku: 'ZMWf1761-Aquamarine', wholesale: 650.00}, // Willow Leaf, Aquamarine
  'P07859-P00125': {sku: 'ZMMdSn23-Ruby', wholesale: 750.00}, // Ruby Sonora Mandala, Small (23in Sonora Mandala, Ruby)
  'P07859-P00126': {sku: 'ZMMdSn27-Ruby', wholesale: 980.00}, // Ruby Sonora Mandala, Medium (27in Sonora Mandala, Ruby)
  'P07859-P00127': {sku: 'ZMMdSn32-Ruby', wholesale: 1250.00}, // Ruby Sonora Mandala, Large (32in Sonora Mandala, Ruby)
  'P07859-P00128': {sku: 'ZMMdSl21-LimeAqua', wholesale: 360.00}, // Starlight Mandala, Lime Aqua, Small, Lime Aqua
  'P07859-P00129': {sku: 'ZMMdSl26-LimeAqua', wholesale: 600.00}, // Starlight Mandala, Lime Aqua, Medium, Lime Aqua
  'P07859-P00130': {sku: 'ZMMdSl21-CottonCandy', wholesale: 360.00}, // Starlight Mandala, Cotton Candy, Small, Cotton Candy
  'P07859-P00131': {sku: 'ZMMdSl26-CottonCandy', wholesale: 600.00}, // Starlight Mandala, Cotton Candy, Medium, Cotton Candy
  'P07859-P00132': {sku: 'ZMMdSl21-CapriBlue', wholesale: 360.00}, // Starlight Mandala, Capri Blue, Small, Capri Blue
  'P07859-P00133': {sku: 'ZMMdSl26-CapriBlue', wholesale: 600.00}, // Starlight Mandala, Capri Blue, Medium, Capri Blue
  'P07859-P00134': {sku: 'ZMMdSl26-Cocktail', wholesale: 600.00}, // Starlight Mandala, Cocktail, Medium, Cocktail
  'P07859-P00135': {sku: 'ZMMdSl26-Plum', wholesale: 600.00}, // Starlight Mandala, Plum, Medium, Plum
  'P07859-P00136': {sku: 'ZMMdSl26-Blush', wholesale: 600.00}, // Starlight Mandala, Blush, Medium, Blush
  'P07859-P00137': {sku: 'ZMMdSl21-Blush', wholesale: 360.00}, // Starlight Mandala, Blush, Small, Blush
  'P07859-P00138': {sku: 'ZMMdSl21-Plum', wholesale: 360.00}, // Starlight Mandala, Plum, Small, Plum
  'P07859-P00139': {sku: 'ZMMdSl21-Cocktail', wholesale: 360.00}, // Starlight Mandala, Cocktail, Small, Cocktail
  'P07859-P00144': {sku: 'ZMMdSl21-SweetFern', wholesale: 360.00}, // Starlight Mandala, Sweet Fern, Small, Sweet Fern
  'P07859-P00145': {sku: 'ZMMdSl26-SweetFern', wholesale: 600.00}, // Starlight Mandala, Sweet Fern, Medium, Sweet Fern
  'P07859-P00146': {sku: 'ZMMdSl21-PurpleHaze', wholesale: 360.00}, // Starlight Mandala, Purple Haze, Small, Purple Haze
  'P07859-P00147': {sku: 'ZMMdSl26-PurpleHaze', wholesale: 600.00}, // Starlight Mandala, Purple Haze, Medium, Purple Haze
  'P07859-P00148': {sku: 'ZMCd4532-Seafoam', wholesale: 800.00}, // Clouds, Seafoam
  'P07859-P00149': {sku: 'ZMMdSl26-Cobalt', wholesale: 600.00}, // Starlight Mandala, Cobalt, Medium, Cobalt
  'P07859-P00151': {sku: 'ZMOv2228-GoldenMeadow', wholesale: 375.00}, // Golden Meadow, Medium (22x28 Meadow)
  'P07859-P00152': {sku: 'ZMOv1822-GoldenMeadow', wholesale: 237.50}, // Golden Meadow, Small (18x22 Golden Meadow)
  'P07859-P00153': {sku: 'ZMOv2636-GoldenMeadow', wholesale: 450.00}, // Golden Meadow, Large (26x36 Golden Meadow)
  'P07859-P00154': {sku: 'ZMMdSl26-Pearl', wholesale: 600.00}, // Starlight Mandala, Pearl (26in Starlight Mandala, Pearl)
  'P07859-P00155': {sku: 'ZMCd4532-ChampagneGold', wholesale: 800.00}, // Clouds, Champagne Gold
  'P07859-P00156': {sku: 'ZMNe1850-GoldenTeal', wholesale: 550.00}, // Neslo Long Mirror, Golden Teal (18x50 Neslo, Golden Teal)
  'P07859-P00157': {sku: 'ZMNe1850-MidnightBlue', wholesale: 550.00}, // Neslo Long Mirror, Midnight Blue (18x50 Neslo, Midnight Blue)
  'P07859-P00165': {sku: 'ZMCa2436-SageCream', wholesale: 585.00}, // Sage Cream Arch Mirror (24x36 Arch, Sage Cream)
  'P07859-P00166': {sku: 'ZMRe2428-GoldenChocolate', wholesale: 400.00}, // Golden Chocolate, Medium (24x28 Golden Chocolate)
  'P07859-P00169': {sku: 'ZMCa2436-CinnamonSage', wholesale: 585.00}, // Cinnamon Sage Arch Mirror (24x36 Cinnamon Sage Arch)
  'P07859-P00174': {sku: 'ZMCa2436-IndigoTide', wholesale: 585.00}, // Indigo Tide Arch Mirror (24x36 Indigo Tide Arch)
  'P07859-P00175': {sku: 'ZMRe2428-SeafoamLace', wholesale: 400.00}, // Seafoam Lace, Medium (24x28 Seafoam Lace)
  'P07859-P00176': {sku: 'ZMRe1827-GoldenTeal', wholesale: 325.00}, // Golden Teal Rectangle, Small
  'P07859-P00177': {sku: 'ZMSq30-GoldenTeal', wholesale: 475.00}, // Golden Teal Rectangle, Large
  'P07859-P00178': {sku: 'ZMRe1827-SeafoamLace', wholesale: 325.00}, // Seafoam Lace, Small
  'P07859-P00179': {sku: 'ZMSq30-SeafoamLace', wholesale: 475.00}, // Seafoam Lace, Large
  'P07859-P00180': {sku: 'ZMRe1827-GoldenChocolate', wholesale: 325.00}, // Golden Chocolate, Small
  'P07859-P00181': {sku: 'ZMSq30-GoldenChocolate', wholesale: 475.00}, // Golden Chocolate, Large
}

// -> {sku, wholesale} for an Artful Home item number (either may be
// null), or null for an item not in the table.
export function artfulHomeItem( item )
{
  return ARTFUL_HOME_ITEMS[item?.trim()] ?? null
}
