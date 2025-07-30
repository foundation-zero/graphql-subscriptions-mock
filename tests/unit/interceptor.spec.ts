import { createSubscriptionsInterceptor, type SubscriptionInterceptor } from '@lib/interceptor';
import type { MockSubscription } from '@lib/subscription';
import { ACK_MESSAGE, INIT_MESSAGE, parseNextMessage, toSubscribeMessage } from '@utils/message';
import { beforeEach, describe, expect, test, vitest } from 'vitest';
import { MockWebSocket, MockWebSocketProvider } from './utils/mocks';

interface SubscribeToSomething {
  data: number;
}

interface AnotherSubscription {
  message: string;
}

type TestSubscriptions = {
  SubscribeToSomething: SubscribeToSomething;
  AnotherSubscription: AnotherSubscription;
};

describe('Playwright WebSocket Interceptor', () => {
  let interceptor: SubscriptionInterceptor<TestSubscriptions>;
  let provider: MockWebSocketProvider;

  beforeEach(async () => {
    provider = new MockWebSocketProvider();
    vitest.spyOn(provider, 'onConnect');
    interceptor = await createSubscriptionsInterceptor<TestSubscriptions>(provider);
  });

  test('it creates a WebSocket interceptor', () => {
    expect(interceptor).toBeDefined();
    expect(interceptor.subscribe).toBeDefined();
  });

  test('it listens for new websockets', () => {
    expect(provider.onConnect).toHaveBeenCalledOnce();
  });

  describe('when a new WebSocket connects', () => {
    let socket: MockWebSocket;

    beforeEach(() => {
      socket = new MockWebSocket();
      vitest.spyOn(socket, 'onmessage');
      provider.createSocket(socket);
    });

    test('it subscribes to new messages', () => {
      expect(socket.onmessage).toHaveBeenCalledOnce();
    });

    test('it performs a handshake', () => {
      vitest.spyOn(socket, 'send');
      const initMessage = JSON.stringify(INIT_MESSAGE);
      const ackMessage = JSON.stringify(ACK_MESSAGE);
      socket.handle(initMessage);
      expect(socket.send).toHaveBeenCalledWith(ackMessage);
    });
  });

  describe('mocking subscriptions', () => {
    let socket: MockWebSocket;
    let subscription: MockSubscription<TestSubscriptions, 'SubscribeToSomething'>;
    const SUB_NAME: keyof TestSubscriptions = 'SubscribeToSomething';
    const SUB_ID = '1';

    beforeEach(() => {
      socket = new MockWebSocket();
      subscription = interceptor.subscribe(SUB_NAME);

      vitest.spyOn(socket, 'onmessage');
      provider.createSocket(socket);
    });

    const subscribe = (): void => {
      const subscribeMessage = toSubscribeMessage(SUB_NAME, SUB_ID);

      const message = JSON.stringify(subscribeMessage);
      socket.handle(message);
    };

    test('it can subscribe to a subscription', () => {
      expect(subscription).toBeDefined();
      expect(subscription.subscribers).toEqual([]);
    });

    test('it adds subscribers to a subscription', () => {
      subscribe();
      expect(subscription.subscribers).toHaveLength(1);
    });

    test('it dispatches data to subscribers', () => {
      subscribe();

      subscription.dispatch({ data: 42 });

      expect(socket.sentMessages).toHaveLength(1);

      const message = parseNextMessage<SubscribeToSomething>(socket.sentMessages[0]!);

      expect(message).toBeDefined();

      expect(message!.id).toBe(SUB_ID);
      expect(message!.type).toBe('next');
      expect(message!.payload!.data).toEqual({ data: 42 });
    });

    test('it throws an error if no subscribers are found', () => {
      expect(() => subscription.dispatch({ data: 42 })).toThrow(
        `No subscribers found for operation: ${SUB_NAME}`,
      );
    });
  });
});
