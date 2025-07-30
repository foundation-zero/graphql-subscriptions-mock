import type { SubscriptionInterceptor } from './interceptor';
import type { SubscribeMessage, Subscriptions } from './types';
import { isSubscribeMessage } from './utils/guards';
import { toNextMessage } from './utils/message';

export class MockSubscription<T extends Subscriptions, K extends keyof T = keyof T> {
  constructor(
    private readonly interceptor: SubscriptionInterceptor<T>,
    private readonly key: K,
  ) {}

  public get subscribers(): SubscribeMessage[] {
    return this.interceptor.incoming
      .filter(isSubscribeMessage)
      .filter((msg) => msg.payload?.operationName === this.key);
  }

  public dispatch(data: T[K]): void {
    if (this.subscribers.length === 0) {
      throw new Error(`No subscribers found for operation: ${String(this.key)}`);
    }

    this.subscribers.forEach((sub) => {
      this.interceptor.dispatch(toNextMessage(sub.id!, data));
    });
  }
}
