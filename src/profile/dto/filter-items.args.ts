import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

@ArgsType()
export class ProjectsFilterArgs {
  @Field(() => String, { nullable: true, description: 'Поиск по названию или описанию проекта' })
  @IsOptional()
  @IsString()
  search?: string;

  @Field(() => String, { nullable: true, description: 'Фильтр по технологии из стека (например, React или TypeScript)' })
  @IsOptional()
  @IsString()
  tech?: string;

  @Field(() => Int, { nullable: true, defaultValue: 10, description: 'Количество записей (пагинация)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;

  @Field(() => Int, { nullable: true, defaultValue: 0, description: 'Смещение (пагинация)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number = 0;
}

@ArgsType()
export class SkillsFilterArgs {
  @Field(() => String, { nullable: true, description: 'Фильтр по категории навыка (Core, Frontend, Tools и т.д.)' })
  @IsOptional()
  @IsString()
  category?: string;

  @Field(() => String, { nullable: true, description: 'Поиск по названию навыка' })
  @IsOptional()
  @IsString()
  search?: string;
}
