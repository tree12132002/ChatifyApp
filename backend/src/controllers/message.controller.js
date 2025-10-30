import db from '../../models/index.js'
import { Op } from 'sequelize'

const { Message, User } = db

export const getAllContacts = async (req, res) => {
  const loggedInUserId = req.user.id

  try {
    const filteredUsers = await User.findAll({
      where: {
        id: { [Op.ne]: loggedInUserId }
      },
      attributes: { exclude: ['password'] }
    })

    res.status(200).json(filteredUsers)
  } catch (error) {
    console.error('Error in getAllContacts: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
export const getMessagesByUserId = async (req, res) => {
  const myId = req.user.id
  const { id: userToChatId } = req.params

  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          {
            [Op.and]: [{ senderId: myId }, { receiverId: userToChatId }]
          },
          {
            [Op.and]: [{ senderId: userToChatId }, { receiverId: myId }]
          }
        ]
      }
    })

    res.status(200).json(messages)
  } catch (error) {
    console.error('Error in getMessages controller: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
export const sendMessage = async (req, res) => {
  const { text, image } = req.body
  const { id: receiverId } = req.params
  const senderId = req.user.id
  let imageUrl

  try {
    if (image) {
      // upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image)

      imageUrl = uploadResponse.secure_url
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl
    })

    await newMessage.save()

    // todo: send message in real-time if user is online - socket.io

    res.status(201).json(newMessage)
  } catch (error) {
    console.error('Error in sendMessage controller: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
export const getChatPartners = async (req, res) => {
  const loggedInUserId = req.user.id

  try {
    // find all the messages where the logged-in user is either sender or receiver
    const messages = await Message.findAll({
      where: {
        [Op.or]: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }]
      }
    })
    const chatPartnerIds = [
      ...new Set(
        messages.map(msg =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      )
    ]
    const chatPartners = await User.findAll({
      where: { id: { [Op.in]: chatPartnerIds } },
      attributes: { exclude: ['password'] }
    })

    res.status(200).json(chatPartners)
  } catch (error) {
    console.error('Error in getChatPartners: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
