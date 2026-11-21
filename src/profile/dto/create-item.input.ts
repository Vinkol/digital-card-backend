import { Field, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, IsArray, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

@InputType({ description: 'Данные для добавления нового навыка' })
export class CreateSkillInput {
  @Field()
  @IsString()
  @MinLength(1)
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  category?: string;
}

@InputType({ description: 'Данные для добавления нового проекта' })
export class CreateProjectInput {
  @Field()
  @IsString()
  @MinLength(2)
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUrl()
  liveUrl?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUrl()
  repoUrl?: string;

  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  techStack: string[];
}
