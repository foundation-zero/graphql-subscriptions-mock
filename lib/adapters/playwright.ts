import type { Page, WebSocketRoute } from 'playwright';
import type { PlaywrightTestArgs, TestFixture } from 'playwright/test';
import { createSubscriptionsInterceptor, type SubscriptionInterceptor } from '../interceptor';
import type { Subscriptions, WebSocketLike, WebSocketListener, WebSocketProvider } from '../types';

export class WebSocketRouteAdapter implements WebSocketLike {
  constructor(private readonly ws: WebSocketRoute) {}

  send(data: string): void {
    this.ws.send(data);
  }

  onmessage(handler: (ev: string | Buffer) => void): void {
    this.ws.onMessage(handler);
  }
}

export class PlaywrightWebSocketProvider implements WebSocketProvider {
  constructor(
    private readonly url: string,
    private readonly page: Page,
  ) {}

  async onConnect(listener: WebSocketListener): Promise<void> {
    try {
      await this.page.routeWebSocket(this.url, (ws) => {
        const adapter = new WebSocketRouteAdapter(ws);
        listener(adapter);
      });
    } catch (e: unknown) {
      console.error('Failed to route WebSocket:', this.url, e);
      throw e;
    }
  }
}

export const createSubscriptionFixture = <Subs extends Subscriptions>(
  url: string,
): [
  TestFixture<SubscriptionInterceptor<Subs>, PlaywrightTestArgs>,
  {
    scope: 'test';
    auto: boolean;
  },
] => [
  async ({ page }, use) => {
    const interceptor = await createSubscriptionsInterceptor<Subs>(
      new PlaywrightWebSocketProvider(url, page),
    );

    await use(interceptor);
  },
  {
    scope: 'test',
    auto: true,
  },
];
