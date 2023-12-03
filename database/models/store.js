import { Model, DataTypes } from 'sequelize';
import connection from '../connection';

const initStore = (sequelize, Types) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Store.init(
    {
      name: Types.STRING,
      url: Types.STRING,
      email: Types.STRING,
      phone: Types.STRING,
    },
    {
      sequelize,
      modelName: 'Store',
      tableName: 'stores',
      createdAt: 'created_at',
      updated_at: 'updated_at',
    }
  );
  return Store;
};

export default initStore( connection, DataTypes );
