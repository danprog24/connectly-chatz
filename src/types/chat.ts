export interface Message {
  id: string | number
  sender: {
    id : number
    username : string
    avatar : string
  }
  content: string
  status: 'sent' | 'failed' | 'sending'
  timestamp: string
}

export interface Friend {
  id: number    
  username: string
  online: boolean
  avatar: string
  lastMessageTime: string
  lastMessageContent: string
  unreadCount: number
  lastMessage: string
  timestamp: string
  unread: number
}   