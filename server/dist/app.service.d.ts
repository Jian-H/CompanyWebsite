import { OnModuleInit } from '@nestjs/common';
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
export declare class AppService implements OnModuleInit {
    private readonly prisma;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    getHello(): string;
    getHealth(): {
        status: string;
        timestamp: string;
    };
    getPublicHomePage(): Promise<{
        setting: {
            id: number;
            siteName: string;
            logoText: string;
            seoTitle: string;
            seoDesc: string;
            contactText: string;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        hero: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            highlight: string;
            subtitle: string;
            primaryLabel: string;
            primaryHref: string;
            secondaryLabel: string;
            secondaryHref: string;
            backgroundImage: string;
            isEnabled: boolean;
            updatedBy: string;
        } | null;
        advantages: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            isEnabled: boolean;
            updatedBy: string;
            icon: string;
            description: string;
            sortOrder: number;
        }[];
        products: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isEnabled: boolean;
            updatedBy: string;
            description: string;
            sortOrder: number;
            coverImage: string;
            href: string;
        }[];
        solutions: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            isEnabled: boolean;
            updatedBy: string;
            description: string;
            sortOrder: number;
            coverImage: string;
            href: string;
            industry: string;
        }[];
        articles: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            updatedBy: string;
            sortOrder: number;
            coverImage: string;
            category: string;
            summary: string;
            body: string;
            isPublished: boolean;
            publishedAt: Date | null;
        }[];
    }>;
    getAdminHomePage(): Promise<{
        setting: {
            id: number;
            siteName: string;
            logoText: string;
            seoTitle: string;
            seoDesc: string;
            contactText: string;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        hero: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            highlight: string;
            subtitle: string;
            primaryLabel: string;
            primaryHref: string;
            secondaryLabel: string;
            secondaryHref: string;
            backgroundImage: string;
            isEnabled: boolean;
            updatedBy: string;
        } | null;
        advantages: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            isEnabled: boolean;
            updatedBy: string;
            icon: string;
            description: string;
            sortOrder: number;
        }[];
        products: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isEnabled: boolean;
            updatedBy: string;
            description: string;
            sortOrder: number;
            coverImage: string;
            href: string;
        }[];
        solutions: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            isEnabled: boolean;
            updatedBy: string;
            description: string;
            sortOrder: number;
            coverImage: string;
            href: string;
            industry: string;
        }[];
        articles: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            updatedBy: string;
            sortOrder: number;
            coverImage: string;
            category: string;
            summary: string;
            body: string;
            isPublished: boolean;
            publishedAt: Date | null;
        }[];
    }>;
    updateHomePage(payload: HomePageInput, operator: string): Promise<{
        setting: {
            id: number;
            siteName: string;
            logoText: string;
            seoTitle: string;
            seoDesc: string;
            contactText: string;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        hero: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            highlight: string;
            subtitle: string;
            primaryLabel: string;
            primaryHref: string;
            secondaryLabel: string;
            secondaryHref: string;
            backgroundImage: string;
            isEnabled: boolean;
            updatedBy: string;
        } | null;
        advantages: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            isEnabled: boolean;
            updatedBy: string;
            icon: string;
            description: string;
            sortOrder: number;
        }[];
        products: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isEnabled: boolean;
            updatedBy: string;
            description: string;
            sortOrder: number;
            coverImage: string;
            href: string;
        }[];
        solutions: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            isEnabled: boolean;
            updatedBy: string;
            description: string;
            sortOrder: number;
            coverImage: string;
            href: string;
            industry: string;
        }[];
        articles: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            updatedBy: string;
            sortOrder: number;
            coverImage: string;
            category: string;
            summary: string;
            body: string;
            isPublished: boolean;
            publishedAt: Date | null;
        }[];
    }>;
    listProducts(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isEnabled: boolean;
        updatedBy: string;
        description: string;
        sortOrder: number;
        coverImage: string;
        href: string;
    }[]>;
    createProduct(payload: ProductInput, operator: string): import("@prisma/client").Prisma.Prisma__ProductClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isEnabled: boolean;
        updatedBy: string;
        description: string;
        sortOrder: number;
        coverImage: string;
        href: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    updateProduct(id: number, payload: ProductInput, operator: string): import("@prisma/client").Prisma.Prisma__ProductClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isEnabled: boolean;
        updatedBy: string;
        description: string;
        sortOrder: number;
        coverImage: string;
        href: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    deleteProduct(id: number): import("@prisma/client").Prisma.Prisma__ProductClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isEnabled: boolean;
        updatedBy: string;
        description: string;
        sortOrder: number;
        coverImage: string;
        href: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    listSolutions(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isEnabled: boolean;
        updatedBy: string;
        description: string;
        sortOrder: number;
        coverImage: string;
        href: string;
        industry: string;
    }[]>;
    createSolution(payload: SolutionInput, operator: string): import("@prisma/client").Prisma.Prisma__SolutionClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isEnabled: boolean;
        updatedBy: string;
        description: string;
        sortOrder: number;
        coverImage: string;
        href: string;
        industry: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    updateSolution(id: number, payload: SolutionInput, operator: string): import("@prisma/client").Prisma.Prisma__SolutionClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isEnabled: boolean;
        updatedBy: string;
        description: string;
        sortOrder: number;
        coverImage: string;
        href: string;
        industry: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    deleteSolution(id: number): import("@prisma/client").Prisma.Prisma__SolutionClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isEnabled: boolean;
        updatedBy: string;
        description: string;
        sortOrder: number;
        coverImage: string;
        href: string;
        industry: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    listArticles(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        updatedBy: string;
        sortOrder: number;
        coverImage: string;
        category: string;
        summary: string;
        body: string;
        isPublished: boolean;
        publishedAt: Date | null;
    }[]>;
    createArticle(payload: ArticleInput, operator: string): import("@prisma/client").Prisma.Prisma__ArticleClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        updatedBy: string;
        sortOrder: number;
        coverImage: string;
        category: string;
        summary: string;
        body: string;
        isPublished: boolean;
        publishedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    updateArticle(id: number, payload: ArticleInput, operator: string): import("@prisma/client").Prisma.Prisma__ArticleClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        updatedBy: string;
        sortOrder: number;
        coverImage: string;
        category: string;
        summary: string;
        body: string;
        isPublished: boolean;
        publishedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    deleteArticle(id: number): import("@prisma/client").Prisma.Prisma__ArticleClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        updatedBy: string;
        sortOrder: number;
        coverImage: string;
        category: string;
        summary: string;
        body: string;
        isPublished: boolean;
        publishedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    getSiteContent(): Promise<SiteContent>;
    updateSiteContent(payload: SiteContentInput, operator: string): Promise<SiteContent>;
    private getHomePage;
    private articleData;
    private seedLegacySiteContent;
    private seedCmsContent;
}
