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
export declare class AppService implements OnModuleInit {
    private readonly prisma;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    getHello(): string;
    getHealth(): {
        status: string;
        timestamp: string;
    };
    getSiteContent(): Promise<SiteContent>;
    updateSiteContent(payload: SiteContentInput, operator: string): Promise<SiteContent>;
}
