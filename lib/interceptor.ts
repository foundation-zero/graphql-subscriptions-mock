import { MockSubscription } from './subscription';
import type { Subscriptions, WebSocketLike, WebSocketMessage, WebSocketProvider } from './types';

export class SubscriptionInterceptor<Subs extends Subscriptions> {
  constructor(private readonly provider: WebSocketProvider) {}

  public readonly incoming: WebSocketMessage[] = [];
  public readonly outgoing: WebSocketMessage[] = [];
  public readonly sockets: WebSocketLike[] = [];

  public subscribe<K extends keyof Subs>(key: K): MockSubscription<Subs, K> {
    return new MockSubscription(this, key);
  }

  public reset(): void {
    this.incoming.length = 0;
    this.outgoing.length = 0;
    this.sockets.length = 0;
  }

  public static async create<Subs extends Subscriptions>(
    provider: WebSocketProvider,
  ): Promise<SubscriptionInterceptor<Subs>> {
    const interceptor = new SubscriptionInterceptor<Subs>(provider);
    await interceptor.init();
    return interceptor;
  }

  public dispatch(message: WebSocketMessage): void {
    this.outgoing.push(message);
    const msg = JSON.stringify(message);
    this.sockets.forEach((socket) => {
      socket.send(msg);
    });
  }

  private onMessage(ev: string | Buffer): void {
    const message: WebSocketMessage = JSON.parse(ev.toString());
    this.incoming.push(message);

    if (message.type === 'connection_init') {
      this.dispatch({ type: 'connection_ack' });
    }
  }

  private async init(): Promise<void> {
    await this.provider.onConnect((socket) => {
      this.sockets.push(socket);
      socket.onmessage((ev) => this.onMessage(ev));
    });
  }
}

export const createSubscriptionsInterceptor = async <Subs extends Subscriptions>(
  provider: WebSocketProvider,
): Promise<SubscriptionInterceptor<Subs>> => await SubscriptionInterceptor.create<Subs>(provider);
