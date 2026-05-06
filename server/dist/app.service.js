"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma/prisma.service");
const DEFAULT_SITE_CONTENT = {
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
let AppService = class AppService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    getHello() {
        return 'Hello World!';
    }
    getHealth() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
        };
    }
    async getSiteContent() {
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
    async updateSiteContent(payload, operator) {
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
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppService);
//# sourceMappingURL=app.service.js.map