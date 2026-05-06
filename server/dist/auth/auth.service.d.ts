import { OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export interface AuthTokenResponse {
    accessToken: string;
    expiresIn: string;
    username: string;
    role: string;
}
export interface AdminJwtPayload {
    sub: number;
    username: string;
    role: string;
}
export interface CreateUserInput {
    username: string;
    password: string;
    displayName?: string;
    role?: string;
}
export interface UserPublic {
    id: number;
    username: string;
    displayName: string | null;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
export declare class AuthService implements OnModuleInit {
    private readonly jwtService;
    private readonly prisma;
    private readonly defaultAdminUsername;
    private readonly defaultAdminPassword;
    private readonly saltRounds;
    constructor(jwtService: JwtService, prisma: PrismaService);
    onModuleInit(): Promise<void>;
    login(username: string, password: string): Promise<AuthTokenResponse>;
    verifyToken(token: string): Promise<AdminJwtPayload>;
    createUser(payload: CreateUserInput): Promise<UserPublic>;
    listUsers(): Promise<UserPublic[]>;
    private mapUserPublic;
    private parseSaltRounds;
}
