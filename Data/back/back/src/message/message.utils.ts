import { Chat } from 'src/chat/chat.entity';
import { User } from 'src/user/user.entity';
import { Message } from './message.entity';

/*
	// check if the sent message in not null.
	// and also chekes if the messages is full of white spaces only!!
*/
export function validateMessage(message: string): boolean {
  if (message == null || message.match(/^\s*$/) !== null) return true;
  return false;
}

export function createNewMessage(
  message: string,
  chatRoom: Chat,
  user: User,
): Message {
  const newMessage = new Message();
  newMessage.value = message;
  newMessage.userId = user;
  newMessage.chatRoomId = chatRoom;
  return newMessage;
}
