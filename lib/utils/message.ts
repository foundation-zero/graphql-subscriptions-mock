import type {
  ConnectionAckMessage,
  ConnectionInitMessage,
  SubscribeMessage,
  SubscriptionDataMessage,
} from '@lib/types';
import { isNextMessage } from './guards';

export const ACK_MESSAGE: ConnectionAckMessage = {
  type: 'connection_ack',
};

export const INIT_MESSAGE: ConnectionInitMessage = {
  type: 'connection_init',
};

export const toSubscribeMessage = (operationName: string, id = '1'): SubscribeMessage => ({
  id,
  type: 'subscribe',
  payload: {
    operationName,
    query: `subscription ${operationName} { test }`,
  },
});

export const toNextMessage = <T>(id: string, data: T): SubscriptionDataMessage<T> => ({
  id,
  type: 'next',
  payload: { data },
});

export const parseNextMessage = <T>(message: string): SubscriptionDataMessage<T> | null => {
  const parsed = JSON.parse(message);
  return isNextMessage<T>(parsed) ? parsed : null;
};
