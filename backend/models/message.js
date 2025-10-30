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
    }
  }
  Message.init(
    {
      senderId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      receiverId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      text: {
        type: DataTypes.STRING
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false
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
