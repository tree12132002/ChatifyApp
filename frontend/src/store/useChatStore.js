import { create } from 'zustand'
import { axiosInstance } from '../libs/axios'
import toast from 'react-hot-toast'

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTabs: 'chats',
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: localStorage.getItem('isSoundEnabled') === true,

  toggleSound: () => {
    localStorage.setItem('isSoundEnabled', !get().isSoundEnabled)
    set({ isSoundEnabled: !get().isSoundEnabled })
  },
  setActiveTab: tab => set({ activeTabs: tab }),
  setSelectedUser: user => set({ selectedUser: user }),

  getAllContacts: async () => {
    set({ isUsersLoading: true })

    try {
      const res = await axiosInstance.post('/messages/contacts')

      set({ allContacts: res.data })
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'An error occurred while fetching contacts'
      )
    } finally {
      set({ isUsersLoading: false })
    }
  },
  getMyChatPartners: async () => {
    set({ isUsersLoading: true })

    try {
      const res = await axiosInstance.post('/messages/chats')

      set({ chats: res.data })
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'An error occurred while fetching chats'
      )
    } finally {
      set({ isUsersLoading: false })
    }
  }
}))
