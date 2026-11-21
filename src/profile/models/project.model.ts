import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Проект из портфолио кандидата' })
export class Project {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => String, { nullable: true })
  liveUrl?: string | null;

  @Field(() => String, { nullable: true })
  repoUrl?: string | null;

  @Field(() => [String])
  techStack: string[];

  @Field(() => Int)
  profileId: number;
}
