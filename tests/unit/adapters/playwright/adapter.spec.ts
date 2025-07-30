import { WebSocketRouteAdapter } from '@lib/adapters/playwright';
import type { WebSocketRoute } from 'playwright';
import { beforeEach, describe, expect, test, vitest } from 'vitest';
import { createMockWebSocket, GRAPHQL_URL } from '.';

describe(WebSocketRouteAdapter, () => {
  let adapter: WebSocketRouteAdapter;
  let mockWebSocket: WebSocketRoute;

  beforeEach(() => {
    mockWebSocket = createMockWebSocket(GRAPHQL_URL);
    adapter = new WebSocketRouteAdapter(mockWebSocket);
  });

  test('it sends data through the WebSocket', () => {
    const data = JSON.stringify({ type: 'test', payload: 'data' });
    adapter.send(data);
    expect(mockWebSocket.send).toHaveBeenCalledWith(data);
  });

  test('it registers a message handler', () => {
    const handler = vitest.fn();
    adapter.onmessage(handler);
    expect(mockWebSocket.onMessage).toHaveBeenCalledWith(handler);
  });
});
