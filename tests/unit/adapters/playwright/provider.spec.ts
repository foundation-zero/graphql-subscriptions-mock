import { PlaywrightWebSocketProvider, WebSocketRouteAdapter } from '@lib/adapters/playwright';
import { asTypeUnsafe } from '@lib/utils/guards';
import type { Page } from 'playwright';
import { beforeEach, describe, expect, test, vitest } from 'vitest';
import { createMockWebSocket, GRAPHQL_URL, PageMock } from '.';

describe(PlaywrightWebSocketProvider, () => {
  let provider: PlaywrightWebSocketProvider;
  let page: PageMock;
  let onConnect = vitest.fn();

  beforeEach(async () => {
    onConnect = vitest.fn();
    page = new PageMock();
    vitest.spyOn(page, 'routeWebSocket');
    provider = new PlaywrightWebSocketProvider(GRAPHQL_URL, asTypeUnsafe<Page>(page));
    await provider.onConnect(onConnect);
  });

  test('it listens for new websockets', () => {
    expect(page.routeWebSocket).toHaveBeenCalledWith(GRAPHQL_URL, expect.any(Function));
    expect(page.handlers.length).toBe(1);
  });

  test('it calls the onConnect listener with a WebSocket adapter', () => {
    const mockWebSocket = createMockWebSocket(GRAPHQL_URL);

    page.handle(mockWebSocket);

    expect(onConnect).toHaveBeenCalledWith(expect.any(WebSocketRouteAdapter));
  });
});
