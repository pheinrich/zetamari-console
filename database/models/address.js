import { Model, DataTypes } from 'sequelize';
import connection from '../connection';

const initAddress = (sequelize, Types) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Address.init(
    {
      name: Types.STRING,
      company: Types.STRING,
      country: Types.STRING,
      line1: Types.STRING,
      line2: Types.STRING,
      line3: Types.STRING,
      city: Types.STRING,
      state: Types.STRING,
      postal_code: Types.STRING,
    },
    {
      sequelize,
      modelName: 'Address',
      tableName: 'addresses',
      createdAt: 'created_at',
      updated_at: 'updated_at',
    }
  );
  return Address;
};

export default initAddress( connection, DataTypes );
