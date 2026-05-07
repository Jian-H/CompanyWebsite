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

export interface SiteSettingInput {
  siteName: string;
  logoText: string;
  seoTitle: string;
  seoDesc: string;
  contactText: string;
}

export interface HomeHeroInput {
  title: string;
  highlight: string;
  subtitle: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  backgroundImage: string;
  isEnabled: boolean;
}

export interface HomeAdvantageInput {
  id?: number;
  icon: string;
  title: string;
  description: string;
  sortOrder: number;
  isEnabled: boolean;
}

export interface ProductInput {
  name: string;
  description: string;
  coverImage: string;
  href: string;
  sortOrder: number;
  isEnabled: boolean;
}

export interface SolutionInput {
  industry: string;
  description: string;
  coverImage: string;
  href: string;
  sortOrder: number;
  isEnabled: boolean;
}

export interface ArticleInput {
  title: string;
  category: string;
  summary: string;
  coverImage: string;
  body: string;
  isPublished: boolean;
  publishedAt?: string | null;
  sortOrder: number;
}

export interface HomePageInput {
  setting: SiteSettingInput;
  hero: HomeHeroInput;
  advantages: HomeAdvantageInput[];
}

const DEFAULT_SITE_CONTENT: SiteContentInput = {
  companyName: 'AuroraTech',
  slogan: '科技驱动未来，创新引领世界',
  home: {
    title: '科技驱动未来',
    subtitle: 'AuroraTech 致力于通过前沿技术与创新解决方案，为全球客户创造价值。',
    primaryAction: {
      label: '探索更多',
      href: '#products',
    },
  },
};

const DEFAULT_SETTING: SiteSettingInput = {
  siteName: 'AuroraTech',
  logoText: 'AuroraTech',
  seoTitle: 'AuroraTech - 科技驱动未来',
  seoDesc: '云计算、人工智能、物联网与安全解决方案企业官网。',
  contactText: '联系我们',
};

const DEFAULT_HERO: HomeHeroInput = {
  title: '科技驱动',
  highlight: '未来',
  subtitle:
    'AuroraTech 致力于通过前沿技术与创新解决方案，为全球客户创造价值，推动行业进步，改变未来生活。',
  primaryLabel: '探索更多',
  primaryHref: '#products',
  secondaryLabel: '观看视频',
  secondaryHref: '#solutions',
  backgroundImage:
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80',
  isEnabled: true,
};

const DEFAULT_ADVANTAGES: HomeAdvantageInput[] = [
  { icon: 'cluster', title: '技术领先', description: '持续投入研发，掌握核心技术引领行业发展', sortOrder: 1, isEnabled: true },
  { icon: 'layers', title: '解决方案', description: '提供全栈服务方案满足多样化业务需求', sortOrder: 2, isEnabled: true },
  { icon: 'shield', title: '安全可靠', description: '高标准安全体系保障数据与业务安全', sortOrder: 3, isEnabled: true },
  { icon: 'users', title: '专业团队', description: '经验丰富的专家团队为客户提供优质服务', sortOrder: 4, isEnabled: true },
];

const DEFAULT_PRODUCTS: ProductInput[] = [
  { name: 'Aurora Cloud', description: '云计算基础设施平台', coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80', href: '#', sortOrder: 1, isEnabled: true },
  { name: 'Aurora AI', description: '人工智能应用平台', coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80', href: '#', sortOrder: 2, isEnabled: true },
  { name: 'Aurora IoT', description: '物联网连接管理平台', coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80', href: '#', sortOrder: 3, isEnabled: true },
  { name: 'Aurora Security', description: '企业级安全解决方案', coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=900&q=80', href: '#', sortOrder: 4, isEnabled: true },
];

const DEFAULT_SOLUTIONS: SolutionInput[] = [
  { industry: '金融行业', description: '数字化转型，助力金融服务升级', coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80', href: '#', sortOrder: 1, isEnabled: true },
  { industry: '制造行业', description: '智能制造，提升生产效率', coverImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80', href: '#', sortOrder: 2, isEnabled: true },
  { industry: '零售行业', description: '智慧零售，优化消费体验', coverImage: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=900&q=80', href: '#', sortOrder: 3, isEnabled: true },
  { industry: '医疗行业', description: '智慧医疗，提升服务质量', coverImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80', href: '#', sortOrder: 4, isEnabled: true },
];

const DEFAULT_ARTICLES: ArticleInput[] = [
  { title: 'AuroraTech 2024 年度技术白皮书', category: '文章', summary: '洞察智能技术趋势与企业数字化实践。', coverImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80', body: '技术白皮书内容占位。', isPublished: true, publishedAt: new Date().toISOString(), sortOrder: 1 },
  { title: 'AI 技术在制造业的应用与实践', category: '文章', summary: '从预测维护到智能质检的落地路径。', coverImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80', body: '制造业 AI 实践内容占位。', isPublished: true, publishedAt: new Date().toISOString(), sortOrder: 2 },
  { title: 'Aurora Cloud 3.0 正式发布', category: '产品', summary: '面向企业级场景的新一代云平台能力。', coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80', body: '产品发布内容占位。', isPublished: true, publishedAt: new Date().toISOString(), sortOrder: 3 },
];

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedLegacySiteContent();
    await this.seedCmsContent();
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

  async getPublicHomePage() {
    return this.getHomePage(true);
  }

  async getAdminHomePage() {
    return this.getHomePage(false);
  }

  async updateHomePage(payload: HomePageInput, operator: string) {
    await this.prisma.siteSetting.upsert({
      where: { id: 1 },
      update: payload.setting,
      create: { id: 1, ...payload.setting },
    });

    await this.prisma.homeHero.upsert({
      where: { id: 1 },
      update: { ...payload.hero, updatedBy: operator },
      create: { id: 1, ...payload.hero, updatedBy: operator },
    });

    await this.prisma.homeAdvantage.deleteMany();
    if (payload.advantages.length > 0) {
      await this.prisma.homeAdvantage.createMany({
        data: payload.advantages.map(({ id: _id, ...item }) => ({
          ...item,
          updatedBy: operator,
        })),
      });
    }

    return this.getAdminHomePage();
  }

  listProducts() {
    return this.prisma.product.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] });
  }

  createProduct(payload: ProductInput, operator: string) {
    return this.prisma.product.create({ data: { ...payload, updatedBy: operator } });
  }

  updateProduct(id: number, payload: ProductInput, operator: string) {
    return this.prisma.product.update({ where: { id }, data: { ...payload, updatedBy: operator } });
  }

  deleteProduct(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }

  listSolutions() {
    return this.prisma.solution.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] });
  }

  createSolution(payload: SolutionInput, operator: string) {
    return this.prisma.solution.create({ data: { ...payload, updatedBy: operator } });
  }

  updateSolution(id: number, payload: SolutionInput, operator: string) {
    return this.prisma.solution.update({ where: { id }, data: { ...payload, updatedBy: operator } });
  }

  deleteSolution(id: number) {
    return this.prisma.solution.delete({ where: { id } });
  }

  listArticles() {
    return this.prisma.article.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] });
  }

  createArticle(payload: ArticleInput, operator: string) {
    return this.prisma.article.create({
      data: this.articleData(payload, operator),
    });
  }

  updateArticle(id: number, payload: ArticleInput, operator: string) {
    return this.prisma.article.update({
      where: { id },
      data: this.articleData(payload, operator),
    });
  }

  deleteArticle(id: number) {
    return this.prisma.article.delete({ where: { id } });
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

  async updateSiteContent(payload: SiteContentInput, operator: string): Promise<SiteContent> {
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

  private async getHomePage(publicOnly: boolean) {
    const [setting, hero, advantages, products, solutions, articles] = await Promise.all([
      this.prisma.siteSetting.findUnique({ where: { id: 1 } }),
      this.prisma.homeHero.findUnique({ where: { id: 1 } }),
      this.prisma.homeAdvantage.findMany({
        where: publicOnly ? { isEnabled: true } : undefined,
        orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
      }),
      this.prisma.product.findMany({
        where: publicOnly ? { isEnabled: true } : undefined,
        orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
      }),
      this.prisma.solution.findMany({
        where: publicOnly ? { isEnabled: true } : undefined,
        orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
      }),
      this.prisma.article.findMany({
        where: publicOnly ? { isPublished: true } : undefined,
        orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
      }),
    ]);

    return {
      setting,
      hero: publicOnly && hero && !hero.isEnabled ? null : hero,
      advantages,
      products,
      solutions,
      articles,
    };
  }

  private articleData(payload: ArticleInput, operator: string) {
    return {
      ...payload,
      publishedAt: payload.publishedAt ? new Date(payload.publishedAt) : null,
      updatedBy: operator,
    };
  }

  private async seedLegacySiteContent() {
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

  private async seedCmsContent() {
    await this.prisma.siteSetting.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, ...DEFAULT_SETTING },
    });

    await this.prisma.homeHero.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, ...DEFAULT_HERO },
    });

    if ((await this.prisma.homeAdvantage.count()) === 0) {
      await this.prisma.homeAdvantage.createMany({ data: DEFAULT_ADVANTAGES });
    }

    if ((await this.prisma.product.count()) === 0) {
      await this.prisma.product.createMany({ data: DEFAULT_PRODUCTS });
    }

    if ((await this.prisma.solution.count()) === 0) {
      await this.prisma.solution.createMany({ data: DEFAULT_SOLUTIONS });
    }

    if ((await this.prisma.article.count()) === 0) {
      await this.prisma.article.createMany({
        data: DEFAULT_ARTICLES.map((item) => ({
          ...item,
          publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
        })),
      });
    }
  }
}
