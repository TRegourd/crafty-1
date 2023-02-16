import { Message } from "./message";

export interface MessageRepository {
  save(message: Message): Promise<void>;
  getById(messageId: string): Promise<Message>;
  getAllOfUser(user: string): Promise<Message[]>;
}
