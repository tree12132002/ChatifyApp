import db from '../../models/index.js'
import bcrypt from 'bcryptjs'
import { generateToken } from '../libs/utils.js'
import { sendWelcomeEmail } from '../emails/emailHandlers.js'
import { ENV } from '../libs/env.js'
import cloudinary from '../libs/cloudinary.js'

const { User } = db

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters' })
    }

    // check if email is valid: regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' })
    }

    const user = await User.findOne({ where: { email } })

    if (user) return res.status(409).json({ message: 'Email already in use' })

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword
    })

    const savedUser = await newUser.save()
    generateToken(newUser.id, res)

    res.status(201).json({
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic
    })

    try {
      await sendWelcomeEmail(
        savedUser.email,
        savedUser.fullName,
        ENV.CLIENT_URL
      )
    } catch (error) {
      console.error('Failed to send welcome email: ', error)
    }
  } catch (error) {
    console.error('Error in signup controller: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ where: { email } })

    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    // never tell the client which one is incorrect: password or email
    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect)
      return res.status(400).json({ message: 'Invalid credentials' })

    generateToken(user.id, res)

    res.status(200).json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic
    })
  } catch (error) {
    console.error('Error in login controller: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
export const logout = async (_, res) => {
  res.cookie('jwt', '', {
    maxAge: 0,
    httpOnly: true,
    sameSite: 'strict',
    secure: ENV.NODE_ENV === 'development' ? false : true
  })
  res.status(200).json({ message: 'Logged out successfully' })
}
export const updateProfile = async (req, res) => {
  const { profilePic } = req.body

  try {
    if (!profilePic)
      return res.status(400).json({ message: 'Profile pic is required' })

    // Validate it's a data URL
    if (!profilePic.startsWith('data:image/')) {
      return res.status(400).json({ message: 'Invalid image format' })
    }

    // Optional: Check size (data URLs are base64, rough estimate)
    const sizeInBytes = (profilePic.length * 3) / 4
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (sizeInBytes > maxSize) {
      return res.status(400).json({ message: 'Image too large (max 5MB)' })
    }

    const userId = req.user.id
    const uploadResponse = await cloudinary.uploader.upload(profilePic)

    await User.update(
      { profilePic: uploadResponse.secure_url },
      { where: { id: userId } }
    )

    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    })

    res.status(200).json(updatedUser)
  } catch (error) {
    console.error('Error in update profile: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
