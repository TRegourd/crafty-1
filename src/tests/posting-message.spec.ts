import {
	DateProvider,
	EmptyMessageError,
	Message,
	MessageRepository,
	PostMessageCommand,
	PostMessageUseCase,
	TooLongMessageError,
} from '../useCases/postMessage.usecase';

describe('Feature: Posting a message', () => {
	let fixture: Fixture;

	beforeEach(() => {
		fixture = createFixture();
	});
	describe('Rule : A message can contain a max of 280 characters', () => {
		test('Alice can post a message on her timeline', () => {
			fixture.givenNowIs(new Date('2023-07-05T19:00:00'));

			fixture.postNewMessage({ author: 'Alice', message: 'Hello, world' });

			fixture.shouldReturn({
				author: 'Alice',
				message: 'Hello, world',
				date: new Date('2023-07-05T19:00:00'),
			});
		});

		test('Alice cannot post a message with more than 281 characters', () => {
			const textWithLengthOf281 =
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mauris lacus, fringilla eu est vitae, varius viverra nisl. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus suscipit feugiat sollicitudin. Aliquam erat volutpat amet.';

			fixture.givenNowIs(new Date('2023-07-05T19:00:00'));

			fixture.postNewMessage({ author: 'Alice', message: textWithLengthOf281 });

			fixture.shouldReturnError(TooLongMessageError);
		});
	});
	describe('Rule : A message cannot be empty or with only whitespaces', () => {
		test('Alice cannot post an empty message', () => {
			fixture.givenNowIs(new Date('2023-07-05T19:00:00'));

			fixture.postNewMessage({ author: 'Alice', message: '' });

			fixture.shouldReturnError(EmptyMessageError);
		});

		test('Alice cannot post a message with only whitespaces', () => {
			fixture.givenNowIs(new Date('2023-07-05T19:00:00'));

			fixture.postNewMessage({ author: 'Alice', message: '   ' });

			fixture.shouldReturnError(EmptyMessageError);
		});
	});
});

class MessageRepositoryImpl implements MessageRepository {
	message: Message;
	save(_msg: Message): void {
		this.message = _msg;
	}
}

class DateProviderImpl implements DateProvider {
	now: Date;
	getNow(): Date {
		return this.now;
	}
}

function createFixture() {
	const messageRepositoryImpl = new MessageRepositoryImpl();
	const dateProviderImpl = new DateProviderImpl();
	let thrownError: Error;

	const postMessageUseCase = new PostMessageUseCase(
		messageRepositoryImpl,
		dateProviderImpl
	);

	return {
		givenNowIs(now: Date) {
			dateProviderImpl.now = now;
		},

		postNewMessage(postedMessage: PostMessageCommand) {
			try {
				postMessageUseCase.invoke(postedMessage);
			} catch (error) {
				thrownError = error;
			}
		},

		shouldReturn(expectedMessage: Message) {
			expect(expectedMessage).toEqual(messageRepositoryImpl.message);
		},

		shouldReturnError(expectedError: new () => Error) {
			expect(thrownError).toBeInstanceOf(expectedError);
		},
	};
}

type Fixture = ReturnType<typeof createFixture>;
