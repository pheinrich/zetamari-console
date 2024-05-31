module.exports = (sequelize, DataTypes) =>
{
  const MaterialType = sequelize.define(
    'MaterialType',
    {
      name: DataTypes.STRING
    },
    {
      timestamps: false,
      tableName: 'materialTypes'
    }
  )

  MaterialType.associate = function( models )
  {
  }

  return MaterialType
};