'use strict'
import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Message.belongsTo(models.User, { foreignKey: 'senderId', as: 'Sender' })
      Message.belongsTo(models.User, {
        foreignKey: 'receiverId',
        as: 'Receiver'
      })
    }
  }
  Message.init(
    {
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      text: {
        type: DataTypes.STRING,
        validate: { len: [0, 2000] }
      },
      image: {
        type: DataTypes.STRING
      }
    },
    {
      sequelize,
      modelName: 'Message',
      tableName: 'Messages'
    }
  )
  return Message
}
