import { test as base } from 'playwright/test';

import { createSubscriptionFixture } from '@lib/adapters/playwright';
import type { SubscriptionInterceptor } from '@lib/interceptor';

const GRAPHQL_URL = 'ws://localhost:8080/graphql';

interface SubscribeToSomething {
  data: number;
}

interface AnotherSubscription {
  message: string;
}

type TestSubscriptions = {
  SubscribeToSomething: SubscribeToSomething;
  AnotherSubscription: AnotherSubscription;
};

const test = base.extend<{
  subscriptions: SubscriptionInterceptor<TestSubscriptions>;
}>({
  subscriptions: createSubscriptionFixture(GRAPHQL_URL),
});

test.describe('Playwright Subscription Fixture', () => {
  test('should show the data for SubscribeToSomething', async ({ subscriptions, page }) => {
    const subscribeToSomething = subscriptions.subscribe('SubscribeToSomething');
    const data: SubscribeToSomething = { data: 42 };

    await page.goto('/');
    await page.waitForTimeout(100);
    subscribeToSomething.dispatch(data);
    await page.waitForTimeout(100);

    await test.expect(page.getByTestId('output')).toHaveText(JSON.stringify(data));
  });
});
