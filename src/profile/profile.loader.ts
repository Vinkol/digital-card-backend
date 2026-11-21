import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { PrismaService } from '../prisma/prisma.service';
import { Skill } from './models/skill.model';
import { Experience } from './models/experience.model';
import { Project } from './models/project.model';

@Injectable({ scope: Scope.REQUEST })
export class ProfileLoader {
  public readonly skillsByProfileId: DataLoader<number, Skill[]>;
  public readonly experienceByProfileId: DataLoader<number, Experience[]>;
  public readonly projectsByProfileId: DataLoader<number, Project[]>;

  constructor(private readonly prisma: PrismaService) {
    this.skillsByProfileId = new DataLoader<number, Skill[]>(async (profileIds) => {
      const skills = await this.prisma.orm.public.Skill.all();
      return profileIds.map((id) => skills.filter((s) => s.profileId === id));
    });

    this.experienceByProfileId = new DataLoader<number, Experience[]>(async (profileIds) => {
      const items = await this.prisma.orm.public.Experience.all();
      return profileIds.map((id) =>
        items
          .filter((e) => e.profileId === id)
          .map((e) => ({ ...e, achievements: [...e.achievements] })),
      );
    });

    this.projectsByProfileId = new DataLoader<number, Project[]>(async (profileIds) => {
      const projects = await this.prisma.orm.public.Project.all();
      return profileIds.map((id) =>
        projects
          .filter((p) => p.profileId === id)
          .map((p) => ({ ...p, techStack: [...p.techStack] })),
      );
    });
  }
}

