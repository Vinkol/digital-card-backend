import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsFilterArgs, SkillsFilterArgs } from './dto/filter-items.args';
import { UpdateProfileInput } from './dto/update-profile.input';
import { CreateProjectInput, CreateSkillInput } from './dto/create-item.input';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile() {
    const profile = await this.prisma.orm.public.Profile.first();

    if (!profile) {
      throw new NotFoundException('Профиль кандидата не найден в базе данных');
    }

    return profile;
  }

  async getSkills(filter?: SkillsFilterArgs) {
    const allSkills = await this.prisma.orm.public.Skill.all();

    return allSkills.filter((skill) => {
      if (filter?.category) {
        const cat = skill.category?.toLowerCase() ?? '';
        if (!cat.includes(filter.category.toLowerCase())) {
          return false;
        }
      }

      if (filter?.search) {
        if (!skill.name.toLowerCase().includes(filter.search.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }

  async getExperience() {
    return this.prisma.orm.public.Experience.all();
  }

  async getProjects(filter?: ProjectsFilterArgs) {
    const allProjects = await this.prisma.orm.public.Project.all();

    const filtered = allProjects.filter((project) => {
      if (filter?.search) {
        const query = filter.search.toLowerCase();
        const inName = project.name.toLowerCase().includes(query);
        const inDesc = project.description?.toLowerCase().includes(query) ?? false;
        if (!inName && !inDesc) {
          return false;
        }
      }

      if (filter?.tech) {
        const techQuery = filter.tech.toLowerCase();
        const hasTech = project.techStack.some((t) =>
          t.toLowerCase().includes(techQuery),
        );
        if (!hasTech) {
          return false;
        }
      }

      return true;
    });

    const offset = filter?.offset ?? 0;
    const limit = filter?.limit ?? 10;

    return filtered.slice(offset, offset + limit);
  }

  async updateProfile(input: UpdateProfileInput) {
    const profile = await this.getProfile();

    const cleanData = Object.fromEntries(
      Object.entries(input).filter(([, value]) => value !== undefined),
    );

    if (Object.keys(cleanData).length === 0) {
      return profile;
    }

    return this.prisma.orm.public.Profile.where({ id: profile.id }).update(cleanData);
  }

  async addSkill(input: CreateSkillInput) {
    const profile = await this.getProfile();

    return this.prisma.orm.public.Skill.create({
      name: input.name,
      category: input.category ?? null,
      profileId: profile.id,
    });
  }

  async addProject(input: CreateProjectInput) {
    const profile = await this.getProfile();

    return this.prisma.orm.public.Project.create({
      name: input.name,
      description: input.description ?? null,
      liveUrl: input.liveUrl ?? null,
      repoUrl: input.repoUrl ?? null,
      techStack: input.techStack,
      profileId: profile.id,
    });
  }
}
