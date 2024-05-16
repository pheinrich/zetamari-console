module.exports = (sequelize, DataTypes) =>
{
  const Substrate = sequelize.define(
    'Substrate',
    {
      sku: DataTypes.STRING,
      width: DataTypes.FLOAT,
      height: DataTypes.FLOAT,
      border: DataTypes.FLOAT
    },
    {
      timestamps: true,
      tableName: 'substrates'
    }
  )

  Substrate.associate = function( models )
  {
    Substrate.belongsTo( models.Contour, {as: 'outside', allowNull: false} )
    Substrate.belongsTo( models.Contour, {as: 'inside'} )
    Substrate.belongsTo( models.Contour, {as: 'rabbet'} )
  }

  return Substrate
}