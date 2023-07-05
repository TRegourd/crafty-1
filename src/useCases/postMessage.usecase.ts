export type Message = {
	author: string;
	message: string;
	date: Date;
};

export type PostMessageCommand = {
	author: string;
	message: string;
};

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
		this.messageRepository.save({
			author: postedMessage.author,
			message: postedMessage.message,
			date: this.dateProvider.getNow(),
		});
	}
}
