import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Profile } from './models/profile.model';
import { Skill } from './models/skill.model';
import { Experience } from './models/experience.model';
import { Project } from './models/project.model';
import { ProfileService } from './profile.service';
import { ProfileLoader } from './profile.loader';
import { ProjectsFilterArgs, SkillsFilterArgs } from './dto/filter-items.args';
import { UpdateProfileInput } from './dto/update-profile.input';
import { CreateProjectInput, CreateSkillInput } from './dto/create-item.input';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(
    private readonly profileService: ProfileService,
    private readonly profileLoader: ProfileLoader,
  ) {}

  @Query(() => Profile, { description: 'Получить цифровую визитку кандидата' })
  async profile() {
    return this.profileService.getProfile();
  }

  @Query(() => [Skill], { description: 'Получить список навыков с возможностью фильтрации' })
  async skills(@Args() filter: SkillsFilterArgs) {
    return this.profileService.getSkills(filter);
  }

  @Query(() => [Experience], { description: 'Получить опыт работы' })
  async experience() {
    return this.profileService.getExperience();
  }

  @Query(() => [Project], { description: 'Получить список проектов с фильтрацией и пагинацией' })
  async projects(@Args() filter: ProjectsFilterArgs) {
    return this.profileService.getProjects(filter);
  }

  @ResolveField('skills', () => [Skill])
  async resolveSkills(@Parent() profile: Profile, @Args() filter: SkillsFilterArgs) {
    if (filter.category || filter.search) {
      return this.profileService.getSkills(filter);
    }
    return this.profileLoader.skillsByProfileId.load(profile.id);
  }

  @ResolveField('experience', () => [Experience])
  async resolveExperience(@Parent() profile: Profile) {
    return this.profileLoader.experienceByProfileId.load(profile.id);
  }

  @ResolveField('projects', () => [Project])
  async resolveProjects(@Parent() profile: Profile, @Args() filter: ProjectsFilterArgs) {
    if (filter.search || filter.tech || filter.limit !== 10 || filter.offset !== 0) {
      return this.profileService.getProjects(filter);
    }
    return this.profileLoader.projectsByProfileId.load(profile.id);
  }

  @Mutation(() => Profile, { description: 'Обновить основную информацию профиля' })
  async updateProfile(@Args('input') input: UpdateProfileInput) {
    return this.profileService.updateProfile(input);
  }

  @Mutation(() => Skill, { description: 'Добавить новый навык в профиль' })
  async addSkill(@Args('input') input: CreateSkillInput) {
    return this.profileService.addSkill(input);
  }

  @Mutation(() => Project, { description: 'Добавить новый проект в портфолио' })
  async addProject(@Args('input') input: CreateProjectInput) {
    return this.profileService.addProject(input);
  }
}

