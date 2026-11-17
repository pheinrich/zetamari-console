// Artful Home item number -> our SKU, used by parseArtfulHomeOrder().
//
// Artful Home gives every design/size/colour its own item number
// ("P07859-P00152" is Golden Meadow, Small), so this is a flat lookup.
// A null SKU (or a missing entry) leaves the line unmatched, keeping
// Artful Home's item number as its SKU for someone to resolve at review.
//
// Entries are the 84 items on Artist Center's "Inventory & Turnaround
// Time" page as of 2026-11-16. Each comment is Artful Home's title,
// variation, our "Artist Title" (in parentheses) and their wholesale
// price. SKUs are filled in only where the same design at the same size
// is a SKU on Faire; where a SKU is likely but unconfirmed it's
// suggested in the comment instead, for a person to check and fill in.
export const ARTFUL_HOME_SKUS = {
  'P07859-P00001': 'ZMCi19-IrisDp', // Iris Drop Mosaic Mirror, Small (19in Iris Drop), $182.50
  'P07859-P00004': 'ZMOv2228-GoldenBronze', // Golden Bronze Mosaic Mirror, Medium (22x28 Oval, Golden Bronze), $375.00
  'P07859-P00006': 'ZMOv1822-Butterfly', // Butterfly Mirror, Small (18x22 Oval, Butterfly), $237.50
  'P07859-P00007': null, // Teal Drop, Medium (22x28 Oval, Teal Drop), $375.00 - no Teal Drop on Faire
  'P07859-P00018': null, // Teal Drop, Small (18x22 Oval, Teal Drop), $237.50 - no Teal Drop on Faire
  'P07859-P00019': 'ZMCi30-GoldenBronze', // Round Golden Bronze, Large (30in Golden Bronze), $425.00
  'P07859-P00020': 'ZMCi24-GoldenBronze', // Round Golden Bronze, Medium (24in Golden Bronze), $282.50
  'P07859-P00025': null, // Seafoam Purple, Large (30in Seafoam Purple), $425.00 - ZMCi30-PurpleDp? (Faire: "Purple Drop")
  'P07859-P00026': null, // Seafoam Purple, Medium (24in Seafoam Purple), $282.50 - ZMCi24-PurpleDp? (Faire: "Purple Drop")
  'P07859-P00028': null, // Sangria, Medium (22x28 Oval, Sangria), $375.00 - Sangria only rect/square on Faire
  'P07859-P00029': null, // Sangria, Small (18x22 Oval, Sangria), $237.50 - Sangria only rect/square on Faire
  'P07859-P00030': null, // Sangria, Large (26x36 Oval, Sangria), $450.00 - Sangria only rect/square on Faire
  'P07859-P00031': 'ZMCi24-SeafoamDrop', // Seafoam Drop, Medium (24in Seafoam Drop), $282.50
  'P07859-P00032': 'ZMCi30-SeafoamDrop', // Seafoam Drop, Large (30in Seafoam Drop), $425.00
  'P07859-P00034': 'ZMLr3033-GreenTea', // Green Tea Leaf Mirror, Large, $450.00
  'P07859-P00042': 'ZMLr3033-CinnamonSage', // Cinnamon Sage Mirror, Large, $450.00
  'P07859-P00043': null, // Cinnamon Sage Mirror, Small, $243.00 - ZMLr2224-CinnamonSage? (AH Small $243 ~ Faire 22x24 $250)
  'P07859-P00044': null, // Sea Foam Leaf, Small, $243.00 - ZMLr2224-Seafoam? (AH Small $243 ~ Faire 22x24 $250)
  'P07859-P00045': 'ZMLr3033-Seafoam', // Sea Foam Leaf, Large, $450.00
  'P07859-P00046': null, // Mahogany Slate, Medium (24x28 Rectangle, Mahogany Slate), $400.00 - ZMRe2428-MahoganyBronze? (Faire: "Mahogany Bronze")
  'P07859-P00047': null, // Mahogany Slate, Large (30x30 Mahogany Slate), $475.00 - no 30x30 on Faire
  'P07859-P00048': null, // Mahogany Slate, Small (18x27 Rectangle, Mahogany Slate), $325.00 - ZMRe1827-MahoganyBronze? (Faire: "Mahogany Bronze")
  'P07859-P00065': null, // Iris Flower Mirror, Medium (24in Iris Flower), $282.50 - ZMCi24-IrisYellow? (Faire: "Iris Yellow")
  'P07859-P00066': null, // Iris Flower Mirror, Large (30in Iris Flower), $425.00 - ZMCi30-IrisYellow? (Faire: "Iris Yellow")
  'P07859-P00067': 'ZMCi24-PewterDp', // Pewter Drop Mirror, Medium (24in Pewter Drop), $282.50
  'P07859-P00068': 'ZMCi30-PewterDp', // Pewter Drop Mirror, Large (30in Pewter Drop), $425.00
  'P07859-P00073': null, // Mina Gold, $425.00
  'P07859-P00082': null, // Mina Warm Gray, $425.00
  'P07859-P00090': null, // Jasmine Leaf Mirror, Small, $243.00 - ZMLr2224-Jasmine? (AH Small $243 ~ Faire 22x24 $250)
  'P07859-P00091': 'ZMLr3033-Jasmine', // Jasmine Leaf Mirror, Large, $450.00
  'P07859-P00092': 'ZMCi24-IrisDp', // Iris Drop Mosaic Mirror, Medium (24in Iris Drop), $282.50
  'P07859-P00093': 'ZMCi30-IrisDp', // Iris Drop Mosaic Mirror, Large (30in iris Drop), $425.00
  'P07859-P00095': 'ZMCi19-SeafoamDrop', // Seafoam Drop, Small (19in Seafoam Drop), $182.50
  'P07859-P00097': 'ZMCi19-GoldenBronze', // Round Golden Bronze, Small (19in Golden Bronze), $182.50
  'P07859-P00099': null, // Teal Drop, Large (26x36 Oval, Teal Drop), $450.00 - no Teal Drop on Faire
  'P07859-P00100': 'ZMOv1822-GoldenBronze', // Golden Bronze Mosaic Mirror, Small (18x22 Oval, Golden Bronze), $237.50
  'P07859-P00101': null, // Golden Bronze Mosaic Mirror, Large (26x36 Oval, Golden Bronze), $450.00 - ZMOv2636-GoldenBronze? (not on Faire)
  'P07859-P00104': 'ZMOv2228-Butterfly', // Butterfly Mirror, Medium (22x28 Oval, Butterfly), $375.00
  'P07859-P00105': null, // Butterfly Mirror, Large (26x36 oval, Butterfly), $450.00 - ZMOv2636-Butterfly? (not on Faire)
  'P07859-P00107': null, // Clouds, $800.00
  'P07859-P00111': null, // Ebony Mirror, Medium (24in Ebony), $282.50
  'P07859-P00112': null, // Ebony Mirror, Small (19in Ebony), $182.50
  'P07859-P00113': null, // Ebony Mirror, Large (30in Ebony), $425.00
  'P07859-P00114': null, // Frost Drop Mirror, Small (19in Frost Drop), $182.50 - Faire has only 10in Frost Drop
  'P07859-P00115': null, // Frost Drop Mirror, Medium (24in Frost Drop), $282.50 - Faire has only 10in Frost Drop
  'P07859-P00116': null, // Frost Drop Mirror, Large (30in Frost Drop), $425.00 - Faire has only 10in Frost Drop
  'P07859-P00117': null, // Willow Leaf, Aquamarine, $650.00 - ZMWf1761-Special? (Faire custom Willow Mirror, $650)
  'P07859-P00125': null, // Ruby Sonora Mandala, Small (23in Sonora Mandala, Ruby), $750.00
  'P07859-P00126': null, // Ruby Sonora Mandala, Medium (27in Sonora Mandala, Ruby), $980.00
  'P07859-P00127': null, // Ruby Sonora Mandala, Large (32in Sonora Mandala, Ruby), $1,250.00
  'P07859-P00128': null, // Starlight Mandala, Lime Aqua, Small, Lime Aqua, $360.00 - ZMMdSl21-LimeAqua?
  'P07859-P00129': null, // Starlight Mandala, Lime Aqua, Medium, Lime Aqua, $600.00 - ZMMdSl26-LimeAqua?
  'P07859-P00130': null, // Starlight Mandala, Cotton Candy, Small, Cotton Candy, $360.00 - ZMMdSl21-CottonCandy?
  'P07859-P00131': null, // Starlight Mandala, Cotton Candy, Medium, Cotton Candy, $600.00 - ZMMdSl26-CottonCandy?
  'P07859-P00132': 'ZMMdSl21-CapriBlue', // Starlight Mandala, Capri Blue, Small, Capri Blue, $360.00
  'P07859-P00133': null, // Starlight Mandala, Capri Blue, Medium, Capri Blue, $600.00 - ZMMdSl26-CapriBlue?
  'P07859-P00134': null, // Starlight Mandala, Cocktail, Medium, Cocktail, $600.00 - ZMMdSl26-Cocktail?
  'P07859-P00135': null, // Starlight Mandala, Plum, Medium, Plum, $600.00 - ZMMdSl26-Plum?
  'P07859-P00136': null, // Starlight Mandala, Blush, Medium, Blush, $600.00 - ZMMdSl26-Blush?
  'P07859-P00137': null, // Starlight Mandala, Blush, Small, Blush, $360.00 - ZMMdSl21-Blush?
  'P07859-P00138': 'ZMMdSl21-Plum', // Starlight Mandala, Plum, Small, Plum, $360.00
  'P07859-P00139': null, // Starlight Mandala, Cocktail, Small, Cocktail, $360.00 - ZMMdSl21-Cocktail?
  'P07859-P00144': null, // Starlight Mandala, Sweet Fern, Small, Sweet Fern, $360.00 - ZMMdSl21-SweetFern?
  'P07859-P00145': null, // Starlight Mandala, Sweet Fern, Medium, Sweet Fern, $600.00 - ZMMdSl26-SweetFern?
  'P07859-P00146': null, // Starlight Mandala, Purple Haze, Small, Purple Haze, $360.00 - ZMMdSl21-PurpleHaze?
  'P07859-P00147': null, // Starlight Mandala, Purple Haze, Medium, Purple Haze, $600.00 - ZMMdSl26-PurpleHaze?
  'P07859-P00148': null, // Clouds, Seafoam, $800.00
  'P07859-P00149': null, // Starlight Mandala, Cobalt, Medium, Cobalt, $600.00 - ZMMdSl26-Cobalt? (Faire has only 21in Cobalt)
  'P07859-P00151': null, // Golden Meadow, Medium (22x28 Meadow), $375.00
  'P07859-P00152': null, // Golden Meadow, Small (18x22 Golden Meadow), $237.50
  'P07859-P00153': null, // Golden Meadow, Large (26x36 Golden Meadow), $450.00
  'P07859-P00154': null, // Starlight Mandala, Pearl (26in Starlight Mandala, Pearl), $600.00 - ZMMdSl26-Pearl?
  'P07859-P00155': null, // Clouds, Champagne Gold, $800.00
  'P07859-P00156': null, // Neslo Long Mirror, Golden Teal (18x50 Neslo, Golden Teal), $550.00 - ZMNe1850-Special? (Faire custom Neslo, $550)
  'P07859-P00157': null, // Neslo Long Mirror, Midnight Blue (18x50 Neslo, Midnight Blue), $550.00 - ZMNe1850-Special? (Faire custom Neslo, $550)
  'P07859-P00165': 'ZMCa2436-SageCream', // Sage Cream Arch Mirror (24x36 Arch, Sage Cream), $585.00
  'P07859-P00166': 'ZMRe2428-GoldenChoc', // Golden Chocolate, Medium (24x28 Golden Chocolate), $400.00
  'P07859-P00169': null, // Cinnamon Sage Arch Mirror (24x36 Cinnamon Sage Arch), $585.00 - ZMCa2436-CinnamonSage?
  'P07859-P00174': null, // Indigo Tide Arch Mirror (24x36 Indigo Tide Arch), $585.00
  'P07859-P00175': null, // Seafoam Lace, Medium (24x28 Seafoam Lace), $400.00
  'P07859-P00178': null, // Seafoam Lace, Small, $325.00
  'P07859-P00179': null, // Seafoam Lace, Large, $475.00
  'P07859-P00180': null, // Golden Chocolate, Small, $325.00 - ZMRe1827-GoldenChoc? (AH Small $325 = Mahogany Slate 18x27)
  'P07859-P00181': null, // Golden Chocolate, Large, $475.00 - no 30x30 on Faire
}

// -> our SKU for an Artful Home item number, or null if unmapped.
export function artfulHomeSku( item )
{
  return ARTFUL_HOME_SKUS[item?.trim()] ?? null
}
