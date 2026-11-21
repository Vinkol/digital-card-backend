# Digital Card Backend — GraphQL API цифровой визитки

Бэкенд-сервис цифровой визитки разработчика, реализованный на **NestJS**, **GraphQL (Code-First / Apollo Server)**, **Prisma ORM 8** и **PostgreSQL**.

## Стек технологий

- **Framework:** NestJS 11 (TypeScript)
- **API:** GraphQL (`@nestjs/graphql`, `@nestjs/apollo`, Apollo Server 5)
- **Database & ORM:** PostgreSQL 16 + Prisma ORM 8 (`@prisma/orm-postgres`)
- **Performance:** DataLoader (`dataloader`) для батчинга вложенных запросов и предотвращения проблемы **N+1**
- **Validation:** `class-validator` + `class-transformer` (глобальный `ValidationPipe`)
- **Containerization:** Docker + Docker Compose
- **Testing:** Jest (Unit + E2E)

---

## Быстрый запуск (Docker Compose — 1 команда)

Для запуска всего стека (PostgreSQL + NestJS API с автоматической инициализацией схемы БД и заполнением реальными данными) достаточно выполнить:

```bash
docker compose up --build
```

После старта:
- **GraphQL Playground & Endpoint:** `http://localhost:3000/graphql`
- **PostgreSQL:** `localhost:5432` (БД `digital_card`)

При первом запуске контейнер автоматически:
1. Ожидает готовности PostgreSQL (`healthcheck`).
2. Применяет контракт схемы базы данных (`prisma db init`).
3. Идемпотентно заполняет базу данными профиля (`seedDatabase()`).

---

## Локальный запуск (без Docker для API)

1. Установите зависимости:
   ```bash
   npm install
   ```
2. Скопируйте `.env.example` в `.env`:
   ```bash
   cp .env.example .env
   ```
3. Запустите PostgreSQL (например, через Docker):
   ```bash
   docker compose up -d postgres
   ```
4. Инициализируйте схему БД и запустите сервер в режиме разработки:
   ```bash
   npm run db:init
   npm run start:dev
   ```

---

## Примеры GraphQL-запросов (Playground: `http://localhost:3000/graphql`)

### 1. Получить полную цифровую визитку (Query с вложенными сущностями)
```graphql
query GetDigitalCard {
  profile {
    id
    name
    title
    description
    location
    email
    githubUrl
    skills {
      id
      name
      category
    }
    experience {
      id
      company
      position
      period
      achievements
    }
    projects {
      id
      name
      description
      liveUrl
      repoUrl
      techStack
    }
  }
}
```

### 2. Фильтрация и пагинация проектов
```graphql
query FilteredProjects {
  projects(tech: "TypeScript", limit: 5, offset: 0) {
    id
    name
    description
    liveUrl
    repoUrl
    techStack
  }
}
```

### 3. Фильтрация навыков по категории или названию
```graphql
query FilteredSkills {
  skills(category: "Core") {
    id
    name
    category
  }
}
```

### 4. Мутация: обновить информацию профиля
```graphql
mutation UpdateProfile {
  updateProfile(
    input: {
      location: "Минск, Беларусь (готов к удалённой работе)"
    }
  ) {
    id
    name
    title
    location
  }
}
```

### 5. Мутация: добавить новый навык или проект
```graphql
mutation AddSkill {
  addSkill(input: { name: "GraphQL", category: "Backend" }) {
    id
    name
    category
  }
}
```

---

## Тестирование

```bash
# Юнит-тесты бизнес-логики (ProfileService)
npm test

# E2E-тесты GraphQL эндпоинта
npm run test:e2e
```
