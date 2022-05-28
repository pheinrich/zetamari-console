const mirror_shapes = [
{
  name: 'Chapel Arch',
  prefix: 'Ca',
  sizes: [
  {
    nominal_width: 11,
    nominal_height: 53,
    actual_width: 11.375,
    actual_height: 53.375,
    border: 3
  },
  {
    nominal_width: 18,
    nominal_height: 60,
    border: 3
  }]
},
{
  name: 'Cloud',
  prefix: 'Cd',
  sizes: [
  {
    nominal_width: 23,
    nominal_height: 61,
    actual_width: 22.5,
    actual_height: 60.5,
    border: 2.5
  },
  {
    nominal_width: 45,
    nominal_height: 32,
    actual_width: 44,
    actual_height: 31.375,
    border: 3
  },
  {
    nominal_width: 60,
    nominal_height: 24,
    actual_width: 59.125,
    actual_height: 23.5,
    border: 2.5
  }]
},
{
  name: 'Circle',
  prefix: 'Ci',
  sizes: [
  {
    nominal_width: 7,
    nominal_height: 7,
    border: 1.75
  },
  {
    nominal_width: 10,
    nominal_height: 10,
    border: 2.25
  },
  {
    nominal_width: 13,
    nominal_height: 13,
    border: 2.75
  },
  {
    nominal_width: 17,
    nominal_height: 17,
    border: 2.75
  },
  {
    nominal_width: 19,
    nominal_height: 19,
    border: 2.75
  },
  {
    nominal_width: 24,
    nominal_height: 24,
    border: 3
  },
  {
    nominal_width: 30,
    nominal_height: 30,
    border: 3.5
  },
  {
    nominal_width: 36,
    nominal_height: 36,
    border: 3.5
  }]
},
{
  name: 'Cora',
  prefix: 'Cr',
  sizes: [
  {
    nominal_width: 34,
    nominal_height: 24,
    actual_width: 33.5,
    actual_height: 23.5,
    nickname: 'Small'
  },
  {
    nominal_width: 44,
    nominal_height: 31,
    actual_width: 44.125,
    actual_height: 30.625,
    nickname: 'Large'
  }]
},
{
  name: 'Gothic Arch',
  prefix: 'Ga',
  sizes: [
  {
    nominal_width: 10,
    nominal_height: 16,
    actual_width: 9.875,
    actual_height: 15.625
  },
  {
    nominal_width: 11,
    nominal_height: 30
  },
  {
    nominal_width: 13,
    nominal_height: 40
  },
  {
    nominal_width: 24,
    nominal_height: 40
  }]
},
{
  name: 'Leaf',
  prefix: 'Lr',
  sizes: [
  {
    nominal_width: 16,
    nominal_height: 18,
    border: 2.5,
    nickname: 'Small'
  },
  {
    nominal_width: 22,
    nominal_height: 24,
    border: 2.75,
    nickname: 'Medium'
  },
  {
    nominal_width: 30,
    nominal_height: 33,
    border: 3.5,
    nickname: 'Large'
  }]
},
{
  name: 'Oval',
  prefix: 'Ov',
  sizes: [
  {
    nominal_width: 12,
    nominal_height: 15,
    actual_width: 11.5,
    actual_height: 14.5,
    border: 2.5
  },
  {
    nominal_width: 14,
    nominal_height: 20,
    border: 2.75
  },
  {
    nominal_width: 18,
    nominal_height: 22,
    actual_width: 18.5,
    actual_height: 22.5,
    border: 3
  },
  {
    nominal_width: 22,
    nominal_height: 28,
    border: 3.5
  },
  {
    nominal_width: 22,
    nominal_height: 34,
    border: 3.5
  },
  {
    nominal_width: 26,
    nominal_height: 36,
    border: 3.75
  }]
},
{
  name: 'Planet Mandala',
  prefix: 'MdPl',
  sizes: [
  {
    nominal_width: 23,
    nominal_height: 23,
    actual_width: 22.5,
    actual_height: 22.25
  }]
},
{
  name: 'Sonora Mandala',
  prefix: 'MdSn',
  sizes: [
  {
    nominal_width: 23,
    nominal_height: 23,
    actual_width: 23.25,
    actual_height: 23,
    nickname: 'Small'
  },
  {
    nominal_width: 27,
    nominal_height: 27,
    actual_width: 22.25,
    actual_height: 27
  },
  {
    nominal_width: 32,
    nominal_height: 32,
    actual_width: 32.375,
    actual_height: 31.825,
    nickname: 'Large'
  },
  {
    nominal_width: 37,
    nominal_height: 37,
    actual_width: 36.375,
    actual_height: 35.875,
    nickname: 'Extra Large'
  }]
},
{
  name: 'Starlight Mandala',
  prefix: 'MdSl',
  sizes: [
  {
    nominal_width: 7,
    nominal_height: 7,
    nickname: 'Mini'
  },
  {
    nominal_width: 10,
    nominal_height: 10,
    actual_width: 9.625,
    actual_height: 9.75,
    nickname: 'Extra Small'
  },
  {
    nominal_width: 14,
    nominal_height: 14,
    actual_width: 13.25,
    actual_height: 13.25,
    nickname: 'Small'
  },
  {
    nominal_width: 21,
    nominal_height: 21,
    actual_width: 20.25,
    actual_height: 20.375
  },
  {
    nominal_width: 26,
    nominal_height: 26,
    actual_width: 25.5,
    actual_height: 25.75,
    nickname: 'Large'
  },
  {
    nominal_width: 36,
    nominal_height: 36,
    actual_width: 36,
    actual_height: 35.7046,
    nickname: 'Extra Large'
  }]
},
{
  name: 'Mina',
  prefix: 'Mn',
  sizes: [
  {
    nominal_width: 24,
    nominal_height: 24,
    actual_width: 23.625,
    actual_height: 23.625
  }]
},
{
  name: 'Neslo',
  prefix: 'Ne',
  sizes: [
  {
    nominal_width: 16,
    nominal_height: 36,
    actual_width: 15.75,
    actual_height: 36,
    nickname: 'Small'
  },
  {
    nominal_width: 17,
    nominal_height: 50,
    actual_width: 17.25,
    actual_height: 50,
    nickname: 'Large'
  }]
},
{
  name: 'Rectangle',
  prefix: 'Re',
  sizes: [
  {
    nominal_width: 11,
    nominal_height: 18,
    actual_width: 11.5,
    actual_height: 18.5,
    border: 2.5
  },
  {
    nominal_width: 14,
    nominal_height: 32,
    border: 2.5
  },
  {
    nominal_width: 18,
    nominal_height: 27,
    border: 3
  },
  {
    nominal_width: 18,
    nominal_height: 40,
    border: 3.25
  },
  {
    nominal_width: 18,
    nominal_height: 48,
    border: 3.5
  },
  {
    nominal_width: 24,
    nominal_height: 28,
    border: 3.5
  },
  {
    nominal_width: 25,
    nominal_height: 36,
    border: 4.25
  }]
},
{
  name: 'Square',
  prefix: 'Sq',
  sizes: [
  {
    nominal_width: 12,
    nominal_height: 12,
    border: 2.75
  },
  {
    nominal_width: 24,
    nominal_height: 24,
    border: 3.5
  },
  {
    nominal_width: 26,
    nominal_height: 26,
    border: 3.5
  },
  {
    nominal_width: 28,
    nominal_height: 28,
    border: 3.5
  },
  {
    nominal_width: 30,
    nominal_height: 30,
    border: 3.5
  }]
},
{
  name: 'Willow Leaf',
  prefix: 'Wf',
  sizes: [
  {
    nominal_width: 17,
    nominal_height: 61,
    actual_width: 17.125,
    actual_height: 61,
    border: 3
  }]
}]

mirror_shapes.forEach( shape => {
  shape.sizes.forEach( size => {
    if( !size.hasOwnProperty( 'actual_width' ) )
      size.actual_width = size.nominal_width;
    if( !size.hasOwnProperty( 'actual_height' ) )
      size.actual_height = size.nominal_height;
    if( !size.hasOwnProperty( 'border' ) )
      size.border = 1;

    size.chip = `${size.nominal_width}"`
    if( size.nominal_width !== size.nominal_height )
      size.chip += `x${size.nominal_height}"`;

    size.name = `${size.chip} ${shape.name}`
    if( size.hasOwnProperty( 'nickname' ) )
      size.name += ` (${size.nickname})`;

    size.sku = `${shape.prefix}${size.nominal_width}`
    if( size.nominal_width !== size.nominal_height )
      size.sku += size.nominal_height;
  })
})