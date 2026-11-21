import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Технический навык кандидата' })
export class Skill {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  category?: string | null;

  @Field(() => Int)
  profileId: number;
}
