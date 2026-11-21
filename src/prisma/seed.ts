import { db } from './db';

export async function seedDatabase(): Promise<void> {
  const existingProfile = await db.orm.public.Profile.first();

  if (existingProfile) {
    console.log('Seed: база данных уже содержит профиль, пропускаем заполнение.');
    return;
  }

  console.log('Seed: заполняем базу данных профилем...');

  const profile = await db.orm.public.Profile.create({
    name: 'Яшин Дмитрий',
    title: 'Frontend-разработчик (React)',
    description:
      'Frontend-разработчик с опытом коммерческой и проектной разработки 1 год 9 месяцев. Специализируюсь на создании SPA-приложений на React и TypeScript, работе с Redux / Context API и интеграции с REST API. Стремлюсь писать чистый, структурированный и поддерживаемый код.',
    location: 'Минск, Беларусь',
    email: 'xlolikx@gmail.com',
    githubUrl: 'https://github.com',
    linkedinUrl: null,
  });

  await db.orm.public.Skill.createAll([
    { name: 'JavaScript (ES6+)', category: 'Core', profileId: profile.id },
    { name: 'TypeScript', category: 'Core', profileId: profile.id },
    { name: 'React', category: 'Frontend', profileId: profile.id },
    { name: 'Redux / Redux Toolkit', category: 'State Management', profileId: profile.id },
    { name: 'HTML5, CSS3, Sass', category: 'Styling', profileId: profile.id },
    { name: 'REST API', category: 'Integration', profileId: profile.id },
    { name: 'Vite / Webpack', category: 'Build Tools', profileId: profile.id },
    { name: 'Git', category: 'Tools', profileId: profile.id },
  ]);

  await db.orm.public.Experience.createAll([
    {
      company: 'Self-employed (учебные и пет-проекты)',
      position: 'Frontend Developer',
      period: 'Март 2025 — настоящее время (1 год 9 месяцев)',
      achievements: [
        'Разработка SPA-приложений на React и TypeScript, приближенных к реальным задачам',
        'Реализация переиспользуемых компонентов, форм и таблиц',
        'Интеграция с REST API и работа с асинхронными запросами',
        'Управление состоянием приложения с помощью Redux, Redux Toolkit и Context API',
        'Оптимизация, структурирование кода и настройка инструментов качества (ESLint, Prettier, Husky)',
      ],
      profileId: profile.id,
    },
  ]);

  await db.orm.public.Project.createAll([
    {
      name: 'Blog Platform',
      description:
        'SPA на React + TypeScript с использованием Redux Toolkit. Реализованы CRUD-операции, работа с пользователями, защита маршрутов через PrivateRoute и API-сервисы.',
      liveUrl: 'https://vercel.app',
      repoUrl: 'https://github.com/blog-platform',
      techStack: ['React', 'TypeScript', 'Redux Toolkit', 'REST API', 'ESLint', 'Prettier'],
      profileId: profile.id,
    },
    {
      name: 'Aviasales App',
      description:
        'SPA на React для поиска и фильтрации авиабилетов с использованием Redux. Реализованы reducers и actions для фильтрации, сортировки и динамического обновления данных.',
      liveUrl: 'https://vercel.app',
      repoUrl: 'https://github.com/aviasales',
      techStack: ['React', 'Redux', 'SASS', 'ESLint', 'Prettier', 'Husky'],
      profileId: profile.id,
    },
    {
      name: 'Movie App',
      description:
        'SPA на React с использованием Context API для управления состоянием фильмов, модульной структурой компонентов и интеграцией с внешними API-сервисами.',
      liveUrl: 'https://vercel.app',
      repoUrl: 'https://github.com/appmovie',
      techStack: ['React', 'Context API', 'SASS/CSS', 'REST API'],
      profileId: profile.id,
    },
    {
      name: 'Task Manager App',
      description:
        'Приложение для управления задачами на React с поддержкой добавления, удаления и фильтрации задач.',
      liveUrl: 'https://vercel.app',
      repoUrl: 'https://github.com/todo-app',
      techStack: ['React', 'JavaScript (ES6+)', 'CSS'],
      profileId: profile.id,
    },
  ]);

  console.log('Seed: база данных успешно заполнена!');
}

if (require.main === module) {
  seedDatabase()
    .then(async () => {
      await db.close();
    })
    .catch(async (err) => {
      console.error('Seed error:', err);
      await db.close();
      process.exit(1);
    });
}
