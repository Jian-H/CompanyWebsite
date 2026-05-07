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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const auth_guard_1 = require("./auth/auth.guard");
const auth_service_1 = require("./auth/auth.service");
let AppController = class AppController {
    appService;
    authService;
    constructor(appService, authService) {
        this.appService = appService;
        this.authService = authService;
    }
    getHello() {
        return this.appService.getHello();
    }
    getHealth() {
        return this.appService.getHealth();
    }
    async getSiteContent() {
        return this.appService.getSiteContent();
    }
    async getPublicHomePage() {
        return this.appService.getPublicHomePage();
    }
    async getPublicArticle(id) {
        const articles = await this.appService.listArticles();
        return articles.find((article) => article.id === Number(id) && article.isPublished) ?? null;
    }
    async login(payload) {
        return this.authService.login(payload.username, payload.password);
    }
    async listUsers() {
        return this.authService.listUsers();
    }
    async createUser(payload, request) {
        if (request.user?.role !== 'admin') {
            throw new common_1.ForbiddenException('只有管理员可以创建账号');
        }
        return this.authService.createUser(payload);
    }
    async getAdminSiteContent() {
        return this.appService.getSiteContent();
    }
    async getAdminHomePage() {
        return this.appService.getAdminHomePage();
    }
    async updateHomePage(payload, request) {
        const operator = request.user?.username ?? 'unknown';
        return this.appService.updateHomePage(payload, operator);
    }
    listProducts() {
        return this.appService.listProducts();
    }
    createProduct(payload, request) {
        return this.appService.createProduct(payload, request.user?.username ?? 'unknown');
    }
    updateProduct(id, payload, request) {
        return this.appService.updateProduct(Number(id), payload, request.user?.username ?? 'unknown');
    }
    deleteProduct(id) {
        return this.appService.deleteProduct(Number(id));
    }
    listSolutions() {
        return this.appService.listSolutions();
    }
    createSolution(payload, request) {
        return this.appService.createSolution(payload, request.user?.username ?? 'unknown');
    }
    updateSolution(id, payload, request) {
        return this.appService.updateSolution(Number(id), payload, request.user?.username ?? 'unknown');
    }
    deleteSolution(id) {
        return this.appService.deleteSolution(Number(id));
    }
    listArticles() {
        return this.appService.listArticles();
    }
    createArticle(payload, request) {
        return this.appService.createArticle(payload, request.user?.username ?? 'unknown');
    }
    updateArticle(id, payload, request) {
        return this.appService.updateArticle(Number(id), payload, request.user?.username ?? 'unknown');
    }
    deleteArticle(id) {
        return this.appService.deleteArticle(Number(id));
    }
    async updateSiteContent(payload, request) {
        const operator = request.user?.username ?? 'unknown';
        return this.appService.updateSiteContent(payload, operator);
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Get)('public/site-content'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getSiteContent", null);
__decorate([
    (0, common_1.Get)('public/home-page'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getPublicHomePage", null);
__decorate([
    (0, common_1.Get)('public/articles/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getPublicArticle", null);
__decorate([
    (0, common_1.Post)('admin/auth/login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('admin/users'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "listUsers", null);
__decorate([
    (0, common_1.Post)('admin/users'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createUser", null);
__decorate([
    (0, common_1.Get)('admin/site-content'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAdminSiteContent", null);
__decorate([
    (0, common_1.Get)('admin/home-page'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAdminHomePage", null);
__decorate([
    (0, common_1.Put)('admin/home-page'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateHomePage", null);
__decorate([
    (0, common_1.Get)('admin/products'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "listProducts", null);
__decorate([
    (0, common_1.Post)('admin/products'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Put)('admin/products/:id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)('admin/products/:id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "deleteProduct", null);
__decorate([
    (0, common_1.Get)('admin/solutions'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "listSolutions", null);
__decorate([
    (0, common_1.Post)('admin/solutions'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "createSolution", null);
__decorate([
    (0, common_1.Put)('admin/solutions/:id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "updateSolution", null);
__decorate([
    (0, common_1.Delete)('admin/solutions/:id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "deleteSolution", null);
__decorate([
    (0, common_1.Get)('admin/articles'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "listArticles", null);
__decorate([
    (0, common_1.Post)('admin/articles'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "createArticle", null);
__decorate([
    (0, common_1.Put)('admin/articles/:id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "updateArticle", null);
__decorate([
    (0, common_1.Delete)('admin/articles/:id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "deleteArticle", null);
__decorate([
    (0, common_1.Put)('admin/site-content'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateSiteContent", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        auth_service_1.AuthService])
], AppController);
//# sourceMappingURL=app.controller.js.map