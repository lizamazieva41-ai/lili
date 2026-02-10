import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('TDLib Integration (tdlib module)', () => {
  let app: INestApplication;

  const enabled = process.env.TDLIB_ENABLED === 'true';

  beforeAll(async () => {
    if (!enabled) {
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

  (enabled ? it : it.skip)('/tdlib/health should respond with ready flag', async () => {
    await request(app.getHttpServer())
      .get('/tdlib/health')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('ready');
      });
  });
});

