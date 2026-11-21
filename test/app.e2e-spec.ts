import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('GraphQL API (e2e)', () => {
  let app: INestApplication;

  const mockPrismaService = {
    orm: {
      public: {
        Profile: {
          first: jest.fn().mockResolvedValue({
            id: 1,
            name: 'Яшин Дмитрий',
            title: 'Frontend-разработчик (React)',
            description: 'Frontend-разработчик с опытом разработки SPA на React и TypeScript.',
            location: 'Минск, Беларусь',
            email: 'xlolikx@gmail.com',
            githubUrl: 'https://github.com',
            linkedinUrl: null,
          }),
        },
        Skill: {
          all: jest.fn().mockResolvedValue([
            { id: 1, name: 'TypeScript', category: 'Core', profileId: 1 },
          ]),
        },
        Experience: {
          all: jest.fn().mockResolvedValue([]),
        },
        Project: {
          all: jest.fn().mockResolvedValue([]),
        },
      },
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('должен возвращать профиль и вложенные навыки через GraphQL запрос', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: '{ profile { name title skills { name category } } }',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.profile.name).toBe('Яшин Дмитрий');
        expect(res.body.data.profile.skills[0].name).toBe('TypeScript');
      });
  });
});
