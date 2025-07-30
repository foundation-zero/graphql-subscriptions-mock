import type { WebSocketLike, WebSocketListener, WebSocketMessageHandler } from '@types';

export class MockWebSocket implements WebSocketLike {
  private readonly handlers: WebSocketMessageHandler[] = [];
  public readonly sentMessages: string[] = [];

  send(data: string): void {
    this.sentMessages.push(data);
  }

  onmessage(handler: WebSocketMessageHandler): void {
    this.handlers.push(handler);
  }

  handle(message: string | Buffer): void {
    this.handlers.forEach((handler) => handler(message));
  }
}

export class MockWebSocketProvider implements MockWebSocketProvider {
  public readonly listeners: WebSocketListener[] = [];

  onConnect(listener: WebSocketListener): void {
    this.listeners.push(listener);
  }

  createSocket(socket: WebSocketLike = new MockWebSocket()): WebSocketLike {
    this.listeners.forEach((listener) => listener(socket));
    return socket;
  }
}
