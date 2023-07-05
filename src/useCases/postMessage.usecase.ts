export type Message = {
	author: string;
	message: string;
	date: Date;
};

export type PostMessageCommand = {
	author: string;
	message: string;
};

export class TooLongMessageError extends Error {}
export class EmptyMessageError extends Error {}

export interface MessageRepository {
	save(_msg: Message): void;
}

export interface DateProvider {
	getNow(): Date;
}

export class PostMessageUseCase {
	constructor(
		private messageRepository: MessageRepository,
		private dateProvider: DateProvider
	) {}
	invoke(postedMessage: PostMessageCommand): void {
		if (postedMessage.message.trim().length === 0) {
			throw new EmptyMessageError();
		}
		if (postedMessage.message.length > 280) {
			throw new TooLongMessageError();
		}
		this.messageRepository.save({
			author: postedMessage.author,
			message: postedMessage.message,
			date: this.dateProvider.getNow(),
		});
	}
}
