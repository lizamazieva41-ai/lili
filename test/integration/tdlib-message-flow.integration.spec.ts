import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

/**
 * Integration tests for TDLib message sending flow
 * These tests require TDLib to be enabled and a test account configured
 */
describe('TDLib Message Flow Integration', () => {
  let app: INestApplication;

  const enabled = process.env.TDLIB_ENABLED === 'true';
  const testPhoneNumber = process.env.TEST_PHONE_NUMBER;
  const testUserId = process.env.TEST_USER_ID || 'test-user-id';

  beforeAll(async () => {
    if (!enabled) {
      console.log('TDLib integration tests skipped: TDLIB_ENABLED != true');
      return;
    }

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  (enabled && testPhoneNumber ? describe : describe.skip)(
    'Message sending flow',
    () => {
      let authToken: string;
      let accountId: string;
      let clientId: string;

      beforeAll(async () => {
        // Authenticate user and get token
        // This would typically be done via your auth endpoints
        // For now, we'll assume token is available
        authToken = 'test-token'; // Replace with actual auth flow
      });

      it('should request authentication code', async () => {
        const response = await request(app.getHttpServer())
          .post('/tdlib/auth/request-code')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ phoneNumber: testPhoneNumber })
          .expect(200);

        expect(response.body).toHaveProperty('clientId');
        expect(response.body).toHaveProperty('phoneNumber');
        clientId = response.body.clientId;
      });

      it('should send message after authentication', async () => {
        // This test assumes account is already authenticated
        // In a real scenario, you'd complete the auth flow first

        const response = await request(app.getHttpServer())
          .post('/messages/send')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            accountId: accountId,
            recipient: testPhoneNumber,
            message: {
              text: 'Integration test message',
            },
          })
          .expect(200);

        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('messageId');
        expect(response.body.data).toHaveProperty('status');
      });

      it('should check message status', async () => {
        // Wait a bit for message to be processed
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Check message status via messages endpoint
        const response = await request(app.getHttpServer())
          .get('/messages')
          .set('Authorization', `Bearer ${authToken}`)
          .query({ accountId })
          .expect(200);

        expect(response.body).toHaveProperty('messages');
        // Message should be in SENT or SENDING status
      });
    },
  );

  (enabled ? describe : describe.skip)('Health checks', () => {
    it('should return health status', async () => {
      const response = await request(app.getHttpServer())
        .get('/tdlib/health')
        .expect(200);

      expect(response.body).toHaveProperty('ready');
      expect(response.body).toHaveProperty('clientCount');
      expect(response.body).toHaveProperty('activeSessions');
    });
  });

  (enabled ? describe : describe.skip)('Session management', () => {
    it('should list sessions', async () => {
      const authToken = 'test-token'; // Replace with actual token

      const response = await request(app.getHttpServer())
        .get('/tdlib/sessions')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('sessions');
      expect(response.body).toHaveProperty('total');
      expect(Array.isArray(response.body.sessions)).toBe(true);
    });
  });
});
