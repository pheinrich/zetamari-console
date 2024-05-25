module.exports = (sequelize, DataTypes) =>
{
  const Substrate = sequelize.define(
    'Substrate',
    {
      name: DataTypes.STRING,
      sku: DataTypes.STRING,
      width: DataTypes.FLOAT,
      height: DataTypes.FLOAT,
      border: DataTypes.FLOAT,
      isStock: DataTypes.BOOLEAN,
      isPreset: DataTypes.BOOLEAN
    },
    {
      timestamps: false,
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