import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProfileService', () => {
  let service: ProfileService;

  const mockProfile = {
    id: 1,
    name: 'Яшин Дмитрий',
    title: 'Frontend-разработчик (React)',
    description: 'Frontend-разработчик с опытом разработки SPA на React и TypeScript.',
    location: 'Минск, Беларусь',
    email: 'xlolikx@gmail.com',
    githubUrl: 'https://github.com',
    linkedinUrl: null,
  };

  const mockSkills = [
    { id: 1, name: 'TypeScript', category: 'Core', profileId: 1 },
    { id: 2, name: 'React', category: 'Frontend', profileId: 1 },
    { id: 3, name: 'Git', category: 'Tools', profileId: 1 },
  ];

  const mockProjects = [
    {
      id: 1,
      name: 'Blog Platform',
      description: 'SPA на React + TypeScript с использованием Redux Toolkit',
      liveUrl: 'https://vercel.app',
      repoUrl: 'https://github.com/blog-platform',
      techStack: ['React', 'TypeScript', 'Redux Toolkit'],
      profileId: 1,
    },
    {
      id: 2,
      name: 'Aviasales App',
      description: 'SPA на React для поиска авиабилетов',
      liveUrl: 'https://vercel.app',
      repoUrl: 'https://github.com/aviasales',
      techStack: ['React', 'Redux', 'SASS'],
      profileId: 1,
    },
  ];

  const mockPrismaService = {
    orm: {
      public: {
        Profile: {
          first: jest.fn(),
          where: jest.fn(),
        },
        Skill: {
          all: jest.fn(),
          create: jest.fn(),
        },
        Experience: {
          all: jest.fn(),
        },
        Project: {
          all: jest.fn(),
          create: jest.fn(),
        },
      },
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  it('должен возвращать профиль кандидата', async () => {
    mockPrismaService.orm.public.Profile.first.mockResolvedValue(mockProfile);

    const result = await service.getProfile();
    expect(result).toEqual(mockProfile);
  });

  it('должен выбрасывать NotFoundException, если профиль не найден', async () => {
    mockPrismaService.orm.public.Profile.first.mockResolvedValue(null);

    await expect(service.getProfile()).rejects.toThrow(NotFoundException);
  });

  it('должен фильтровать навыки по категории и поиску', async () => {
    mockPrismaService.orm.public.Skill.all.mockResolvedValue(mockSkills);

    const byCategory = await service.getSkills({ category: 'Core' });
    expect(byCategory).toHaveLength(1);
    expect(byCategory[0].name).toBe('TypeScript');

    const bySearch = await service.getSkills({ search: 'react' });
    expect(bySearch).toHaveLength(1);
    expect(bySearch[0].name).toBe('React');
  });

  it('должен фильтровать проекты по технологии и применять пагинацию', async () => {
    mockPrismaService.orm.public.Project.all.mockResolvedValue(mockProjects);

    const tsProjects = await service.getProjects({ tech: 'TypeScript', limit: 10, offset: 0 });
    expect(tsProjects).toHaveLength(1);
    expect(tsProjects[0].name).toBe('Blog Platform');

    const paginated = await service.getProjects({ limit: 1, offset: 1 });
    expect(paginated).toHaveLength(1);
    expect(paginated[0].name).toBe('Aviasales App');
  });
});
