module.exports = (sequelize, DataTypes) =>
{
  const Shape = sequelize.define(
    'Shape',
    {
      name: DataTypes.STRING,
      prefix: DataTypes.STRING,
      isPrimitive: DataTypes.BOOLEAN
    },
    {
      timestamps: false,
      tableName: 'shapes'
    }
  )

  Shape.associate = function( models )
  {
  }

  return Shape
}
