import {
	DateProvider,
	Message,
	MessageRepository,
	PostMessageCommand,
	PostMessageUseCase,
} from '../useCases/postMessage.usecase';

describe('Feature: Posting a message', () => {
	describe('Rule : A message can contain a max of 280 characters', () => {
		test('Alice can post a message on her timeline', () => {
			givenNowIs(new Date('2023-07-05T19:00:00'));

			postNewMessage({ author: 'Alice', message: 'Hello, world' });

			shouldReturn({
				author: 'Alice',
				message: 'Hello, world',
				date: new Date('2023-07-05T19:00:00'),
			});
		});
	});
});

let message: Message;

class MessageRepositoryImpl implements MessageRepository {
	save(_msg: Message): void {
		message = _msg;
	}
}

class DateProviderImpl implements DateProvider {
	now: Date;
	getNow(): Date {
		return this.now;
	}
}

const messageRepositoryImpl = new MessageRepositoryImpl();
const dateProviderImpl = new DateProviderImpl();

const postMessageUseCase = new PostMessageUseCase(
	messageRepositoryImpl,
	dateProviderImpl
);

function givenNowIs(now: Date) {
	dateProviderImpl.now = now;
}

function postNewMessage(postedMessage: PostMessageCommand) {
	postMessageUseCase.invoke(postedMessage);
}

function shouldReturn(expectedMessage: Message) {
	expect(expectedMessage).toEqual(message);
}
