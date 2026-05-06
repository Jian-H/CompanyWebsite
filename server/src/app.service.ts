import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

export interface HomeSection {
  title: string;
  subtitle: string;
  primaryAction: {
    label: string;
    href: string;
  };
}

export interface SiteContent {
  companyName: string;
  slogan: string;
  updatedAt: string;
  updatedBy: string;
  createdBy: string;
  home: HomeSection;
}

export interface SiteContentInput {
  companyName: string;
  slogan: string;
  home: HomeSection;
}

const DEFAULT_SITE_CONTENT: SiteContentInput = {
  companyName: 'Acme Digital Co.',
  slogan: 'Build once, publish everywhere',
  home: {
    title: '企业官网内容已接入后台接口',
    subtitle: '下一步可把这里替换成真实CMS数据',
    primaryAction: {
      label: '查看管理后台规划',
      href: '/admin',
    },
  },
};

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.prisma.siteContent.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        companyName: DEFAULT_SITE_CONTENT.companyName,
        slogan: DEFAULT_SITE_CONTENT.slogan,
        homeTitle: DEFAULT_SITE_CONTENT.home.title,
        homeSubtitle: DEFAULT_SITE_CONTENT.home.subtitle,
        primaryActionLabel: DEFAULT_SITE_CONTENT.home.primaryAction.label,
        primaryActionHref: DEFAULT_SITE_CONTENT.home.primaryAction.href,
        createdBy: 'system',
        updatedBy: 'system',
      },
    });
  }

  getHello(): string {
    return 'Hello World!';
  }

  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  async getSiteContent(): Promise<SiteContent> {
    const record = await this.prisma.siteContent.findUnique({
      where: { id: 1 },
    });

    if (!record) {
      return {
        ...DEFAULT_SITE_CONTENT,
        updatedAt: new Date().toISOString(),
        updatedBy: 'system',
        createdBy: 'system',
      };
    }

    return {
      companyName: record.companyName,
      slogan: record.slogan,
      updatedAt: record.updatedAt.toISOString(),
      updatedBy: record.updatedBy,
      createdBy: record.createdBy,
      home: {
        title: record.homeTitle,
        subtitle: record.homeSubtitle,
        primaryAction: {
          label: record.primaryActionLabel,
          href: record.primaryActionHref,
        },
      },
    };
  }

  async updateSiteContent(
    payload: SiteContentInput,
    operator: string,
  ): Promise<SiteContent> {
    const record = await this.prisma.siteContent.upsert({
      where: { id: 1 },
      update: {
        companyName: payload.companyName,
        slogan: payload.slogan,
        homeTitle: payload.home.title,
        homeSubtitle: payload.home.subtitle,
        primaryActionLabel: payload.home.primaryAction.label,
        primaryActionHref: payload.home.primaryAction.href,
        updatedBy: operator,
      },
      create: {
        id: 1,
        companyName: payload.companyName,
        slogan: payload.slogan,
        homeTitle: payload.home.title,
        homeSubtitle: payload.home.subtitle,
        primaryActionLabel: payload.home.primaryAction.label,
        primaryActionHref: payload.home.primaryAction.href,
        createdBy: operator,
        updatedBy: operator,
      },
    });

    return {
      companyName: record.companyName,
      slogan: record.slogan,
      updatedAt: record.updatedAt.toISOString(),
      updatedBy: record.updatedBy,
      createdBy: record.createdBy,
      home: {
        title: record.homeTitle,
        subtitle: record.homeSubtitle,
        primaryAction: {
          label: record.primaryActionLabel,
          href: record.primaryActionHref,
        },
      },
    };
  }
}
