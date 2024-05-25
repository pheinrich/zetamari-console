module.exports = (sequelize, DataTypes) =>
{
  const Contour = sequelize.define(
    'Contour',
    {
      name: DataTypes.STRING,
      svgData: DataTypes.TEXT
    },
    {
      timestamps: false,
      tableName: 'contours'
    }
  )

  Contour.associate = function( models )
  {
    Contour.belongsTo( models.Shape, {as: 'shape', allowNull: false} )
  }

  return Contour
}