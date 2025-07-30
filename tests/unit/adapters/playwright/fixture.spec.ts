import { createSubscriptionFixture } from '@lib/adapters/playwright';
import { SubscriptionInterceptor } from '@lib/interceptor';
import { asTypeUnsafe } from '@lib/utils/guards';
import type { Page } from 'playwright';
import type { PlaywrightTestArgs, TestInfo } from 'playwright/test';
import { describe, expect, test } from 'vitest';
import { GRAPHQL_URL, PageMock } from '.';

describe(createSubscriptionFixture, () => {
  test('it creates a subscription fixture', async () => {
    const [fixtureFn, options] = createSubscriptionFixture(GRAPHQL_URL);
    expect(fixtureFn).toBeDefined();
    expect(fixtureFn).toBeInstanceOf(Function);

    expect(options).toEqual({
      scope: 'test',
      auto: true,
    });
  });

  test('it creates a subscription interceptor', async () => {
    const [fixtureFn] = createSubscriptionFixture(GRAPHQL_URL);

    const page = asTypeUnsafe<Page>(new PageMock());
    const args = asTypeUnsafe<PlaywrightTestArgs>({ page });
    const options = asTypeUnsafe<TestInfo>({});

    let interceptor: SubscriptionInterceptor<never> | undefined = undefined;

    await fixtureFn(
      args,
      async (value) => {
        interceptor = value;
      },
      options,
    );

    expect(interceptor).toBeDefined();
    expect(interceptor).toBeInstanceOf(SubscriptionInterceptor);
  });
});
