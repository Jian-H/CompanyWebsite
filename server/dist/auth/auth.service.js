"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    jwtService;
    prisma;
    defaultAdminUsername = process.env.ADMIN_USERNAME ?? 'admin';
    defaultAdminPassword = process.env.ADMIN_PASSWORD ?? 'admin123456';
    saltRounds = this.parseSaltRounds(process.env.BCRYPT_SALT_ROUNDS);
    constructor(jwtService, prisma) {
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    async onModuleInit() {
        const adminExists = await this.prisma.user.findUnique({
            where: { username: this.defaultAdminUsername },
        });
        if (adminExists) {
            return;
        }
        const passwordHash = await bcrypt.hash(this.defaultAdminPassword, this.saltRounds);
        await this.prisma.user.create({
            data: {
                username: this.defaultAdminUsername,
                passwordHash,
                displayName: '系统管理员',
                role: 'admin',
            },
        });
    }
    async login(username, password) {
        const user = await this.prisma.user.findUnique({
            where: { username },
        });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('用户名或密码错误');
        }
        const passwordValid = await bcrypt.compare(password, user.passwordHash);
        if (!passwordValid) {
            throw new common_1.UnauthorizedException('用户名或密码错误');
        }
        const payload = {
            sub: user.id,
            username: user.username,
            role: user.role,
        };
        return {
            accessToken: this.jwtService.sign(payload),
            expiresIn: '12h',
            username: user.username,
            role: user.role,
        };
    }
    async verifyToken(token) {
        try {
            const payload = await this.jwtService.verifyAsync(token);
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
            });
            if (!user || !user.isActive) {
                throw new common_1.UnauthorizedException('登录态已失效，请重新登录');
            }
            return {
                sub: user.id,
                username: user.username,
                role: user.role,
            };
        }
        catch {
            throw new common_1.UnauthorizedException('登录态已失效，请重新登录');
        }
    }
    async createUser(payload) {
        const exists = await this.prisma.user.findUnique({
            where: { username: payload.username },
        });
        if (exists) {
            throw new common_1.ConflictException('用户名已存在');
        }
        const passwordHash = await bcrypt.hash(payload.password, this.saltRounds);
        const user = await this.prisma.user.create({
            data: {
                username: payload.username,
                passwordHash,
                displayName: payload.displayName?.trim() || null,
                role: payload.role?.trim() || 'editor',
            },
        });
        return this.mapUserPublic(user);
    }
    async listUsers() {
        const users = await this.prisma.user.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return users.map((user) => this.mapUserPublic(user));
    }
    mapUserPublic(user) {
        return {
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        };
    }
    parseSaltRounds(value) {
        const parsed = Number(value);
        if (!Number.isInteger(parsed) || parsed < 4 || parsed > 15) {
            return 10;
        }
        return parsed;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map