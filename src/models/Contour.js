import { DataTypes } from 'sequelize'
import sequelize from 'src/lib/sequelize'

const Contour = sequelize.define( 'Contour',
	{
  	name:
  	{
    	type: DataTypes.STRING,
    	allowNull: false
  	},
  	svgData:
  	{
    	type: DataTypes.TEXT,
    	allowNull: false
    }
  },
	{
  	timestamps: true,
  	tableName: 'contours'
	}
)

export default Contour
