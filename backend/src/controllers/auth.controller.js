import db from '../../models/index.js'
import bcrypt from 'bcryptjs'
import { generateToken } from '../libs/utils.js'

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
      password: hashedPassword,
    })

    await newUser.save()
    generateToken(newUser.id, res)

    res.status(201).json({
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    })

    // todo: send a welcome email to user
  } catch (error) {
    console.error('Error in signup controller: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
