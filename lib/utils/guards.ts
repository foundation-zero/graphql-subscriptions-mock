import type {
  MessageType,
  SubscribeMessage,
  SubscriptionDataMessage,
  WebSocketMessage,
} from '../types';

const MESSAGE_TYPES: MessageType[] = [
  'connection_init',
  'connection_ack',
  'subscribe',
  'next',
  'ping',
  'pong',
];

export const asTypeUnsafe = <T>(val: Partial<T>): T => val as T;

export const isObject = (msg: unknown): msg is object => typeof msg === 'object' && msg !== null;
export const isMessageType = (type: unknown): type is MessageType =>
  typeof type === 'string' && (MESSAGE_TYPES as readonly string[]).includes(type);

export const isWebsocketMessage = (msg: unknown): msg is WebSocketMessage =>
  isObject(msg) && 'type' in msg && isMessageType(msg.type);

export const isNextMessage = <T>(msg: unknown): msg is SubscriptionDataMessage<T> => {
  return (
    isWebsocketMessage(msg) &&
    msg.type === 'next' &&
    'payload' in msg &&
    isObject(msg.payload) &&
    'data' in msg.payload
  );
};

export const isSubscribeMessage = (message: WebSocketMessage): message is SubscribeMessage =>
  isWebsocketMessage(message) && message.type === 'subscribe';
