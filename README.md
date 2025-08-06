### GraphQL subscriptions mock

A lightweight mocking library for GraphQL subscriptions with built-in Playwright testing support.

## Features

- Intercept GraphQL subscriptions and push subscription updates
- Playwright test adapter for easy integration
- TypeScript support

## Installation

```bash
pnpm install -D @foundation-zero/graphql-subscriptions-mock
```

## Playwright Integration

The Playwright adapter uses `page.routeWebSocket()` to intercept WebSocket connections to the GraphQL endpoint. The fixture should be created before a page using subscriptions is visited, since it needs to intercept the websocket connection before it is established by the browser.

### Javascript

```javascript
import { test as base } from 'playwright/test';
import { createSubscriptionFixture } from '@foundation-zero/graphql-subscriptions-mock/adapters/playwright';

const test = base.extend({
  subscriptions: createSubscriptionFixture("ws://your-graphql-endpoint"),
});

test.describe('Playwright Subscription Fixture', () => {
  test('has subscribers', async ({ subscriptions, page }) => {
    const subscribeToSomething = subscriptions.subscribe('SubscribeToSomething');
    const data = { data: 42 };

    await page.goto('/');
    await page.waitForTimeout(100);
    
    test.expect(subscribeToSomething.subscribers).toHaveLength(1);

    subscribeToSomething.dispatch(data);
    await page.waitForTimeout(100);
    
    // Write some expectations based on the subscription update.
  });
});
```

### Typescript

```typescript
import { test as base } from 'playwright/test';
import { createSubscriptionFixture } from '@foundation-zero/graphql-subscriptions-mock/adapters/playwright';
import type { SubscriptionInterceptor } from '@foundation-zero/graphql-subscriptions-mock';

type SubscribeToSomething = {
  data: number;
}

type TestSubscriptions = {
  SubscribeToSomething: SubscribeToSomething;
};

const test = base.extend<{
  subscriptions: SubscriptionInterceptor<TestSubscriptions>;
}>({
  subscriptions: createSubscriptionFixture("ws://your-graphql-endpoint"),
});

test.describe('Playwright Subscription Fixture', () => {
  test('has subscribers', async ({ subscriptions, page }) => {
    const subscribeToSomething = subscriptions.subscribe('SubscribeToSomething');
    const data: SubscribeToSomething = { data: 42 };

    await page.goto('/');
    await page.waitForTimeout(100);
    
    test.expect(subscribeToSomething.subscribers).toHaveLength(1);

    subscribeToSomething.dispatch(data);
    await page.waitForTimeout(100);
    
    // Write some expectations based on the subscription update.
  });
});
```
