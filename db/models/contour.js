module.exports = (sequelize, DataTypes) =>
{
  const Contour = sequelize.define(
    'Contour',
    {
      name: DataTypes.STRING,
      prefix: DataTypes.STRING,
      svgData: DataTypes.TEXT
    },
    {
      timestamps: true,
      tableName: 'contours'
    }
  )

  Contour.associate = function( db )
  {
  }

  return Contour
}