import { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'
import UserLoadingSkeleton from './UsersLoadingSkeleton'
import NoChatsFound from './NoChatsFound'

const ContactList = () => {
  const { getAllContacts, allContacts, isUsersLoading, setSelectedUser } =
    useChatStore()
  const { onlineUsers } = useAuthStore()

  useEffect(() => {
    getAllContacts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isUsersLoading) return <UserLoadingSkeleton />
  if (allContacts.length === 0) return <NoChatsFound />

  return (
    <>
      {allContacts.map(contact => (
        <div
          key={contact.id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(contact)}
        >
          <div className="flex items-center gap-3">
            <div className={`avatar ${onlineUsers.includes(contact.id) ? 'avatar-online' : 'avatar-offline'}`}>
              <div className="size-12 rounded-full">
                <img
                  src={contact.profilePic || '/avatar.png'}
                  alt={contact.fullName}
                />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate">
              {contact.fullName}
            </h4>
          </div>
        </div>
      ))}
    </>
  )
}

export default ContactList
