import { AppService, type ArticleInput, type HomePageInput, type ProductInput, type SiteContent, type SiteContentInput, type SolutionInput } from './app.service';
import { AuthService, type AuthTokenResponse, type CreateUserInput, type UserPublic } from './auth/auth.service';
interface LoginRequest {
    username: string;
    password: string;
}
interface RequestWithUser {
    user?: {
        userId: number;
        username: string;
        role: string;
    };
}
export declare class AppController {
    private readonly appService;
    private readonly authService;
    constructor(appService: AppService, authService: AuthService);
    getHello(): string;
    getHealth(): {
        status: string;
        timestamp: string;
    };
    getSiteContent(): Promise<SiteContent>;
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
    getPublicArticle(id: string): Promise<{
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
    } | null>;
    login(payload: LoginRequest): Promise<AuthTokenResponse>;
    listUsers(): Promise<UserPublic[]>;
    createUser(payload: CreateUserInput, request: RequestWithUser): Promise<UserPublic>;
    getAdminSiteContent(): Promise<SiteContent>;
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
    updateHomePage(payload: HomePageInput, request: RequestWithUser): Promise<{
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
    createProduct(payload: ProductInput, request: RequestWithUser): import("@prisma/client").Prisma.Prisma__ProductClient<{
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
    updateProduct(id: string, payload: ProductInput, request: RequestWithUser): import("@prisma/client").Prisma.Prisma__ProductClient<{
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
    deleteProduct(id: string): import("@prisma/client").Prisma.Prisma__ProductClient<{
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
    createSolution(payload: SolutionInput, request: RequestWithUser): import("@prisma/client").Prisma.Prisma__SolutionClient<{
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
    updateSolution(id: string, payload: SolutionInput, request: RequestWithUser): import("@prisma/client").Prisma.Prisma__SolutionClient<{
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
    deleteSolution(id: string): import("@prisma/client").Prisma.Prisma__SolutionClient<{
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
    createArticle(payload: ArticleInput, request: RequestWithUser): import("@prisma/client").Prisma.Prisma__ArticleClient<{
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
    updateArticle(id: string, payload: ArticleInput, request: RequestWithUser): import("@prisma/client").Prisma.Prisma__ArticleClient<{
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
    deleteArticle(id: string): import("@prisma/client").Prisma.Prisma__ArticleClient<{
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
    updateSiteContent(payload: SiteContentInput, request: RequestWithUser): Promise<SiteContent>;
}
export {};
