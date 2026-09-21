import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('returns the API status', () => {
    const controller = new HealthController();

    expect(controller.check()).toEqual({ status: 'ok' });
  });
});
