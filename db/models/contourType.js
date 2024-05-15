'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ContourType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      console.log( 'associate' )
      // define association here
    }
  }
  ContourType.init({
    name: DataTypes.STRING,
    prefix: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'contourType',
  });
  return ContourType;
};