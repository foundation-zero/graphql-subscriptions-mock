export type MessageType =
  | 'connection_init'
  | 'connection_ack'
  | 'ping'
  | 'pong'
  | 'subscribe'
  | 'next';

export interface KeepAlivePayload {
  message: 'keepalive';
}

export interface SubscriptionDispatcher<Subs extends Subscriptions> {
  <K extends keyof Subs>(key: K, data: Subs[K]): void;
  <K extends keyof Subs>(key: K): SubscriptionDispatch<Subs[K]>;
}

export type SubscriptionDispatch<T> = (data: T) => void;

export interface ConnectionInitPayload {
  headers: Record<string, string>;
}

export interface GraphqlQueryPayload {
  query: string;
  variables?: Record<string, unknown>;
  operationName?: string;
}

export interface GraphqlDataPayload<T = unknown> {
  data: T;
}

export interface WebSocketMessage<
  Payload extends object | undefined = object,
  Type extends MessageType = MessageType,
> {
  id?: string;
  type: Type;
  payload?: Payload;
}

export type WebSocketMessageHandler = (ev: string | Buffer) => void;

export type PingMessage = WebSocketMessage<KeepAlivePayload, 'ping'>;
export type PongMessage = WebSocketMessage<KeepAlivePayload, 'pong'>;
export type ConnectionInitMessage = WebSocketMessage<ConnectionInitPayload, 'connection_init'>;
export type SubscribeMessage = WebSocketMessage<GraphqlQueryPayload, 'subscribe'>;
export type ConnectionAckMessage = WebSocketMessage<undefined, 'connection_ack'>;
export type SubscriptionDataMessage<T = unknown> = WebSocketMessage<GraphqlDataPayload<T>, 'next'>;

export type Subscriptions = Record<string, unknown>;

export interface WebSocketLike {
  send: (data: string) => void;
  onmessage: (handler: WebSocketMessageHandler) => void;
}

export type WebSocketListener = (socket: WebSocketLike) => void;
export interface WebSocketProvider {
  onConnect: (listener: WebSocketListener) => void | Promise<void>;
}
