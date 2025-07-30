import { asTypeUnsafe } from '@lib/utils/guards';
import type { Page, WebSocketRoute } from 'playwright';
import { vitest } from 'vitest';

export type WebSocketRouteHandler = Parameters<Page['routeWebSocket']>[1];

export class PageMock implements Partial<Page> {
  public readonly handlers: WebSocketRouteHandler[] = [];

  async routeWebSocket(url: string, handler: WebSocketRouteHandler): Promise<void> {
    this.handlers.push(handler);
    await Promise.resolve();
  }

  handle(route: WebSocketRoute): void {
    this.handlers.forEach((handler) => {
      handler(route);
    });
  }
}

export const createMockWebSocket = (url: string): WebSocketRoute =>
  asTypeUnsafe<WebSocketRoute>({
    send: vitest.fn(),
    onMessage: vitest.fn(),
    url: () => url,
  });

export const GRAPHQL_URL = 'ws://example.com/graphql';
