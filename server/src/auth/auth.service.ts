import {
  ConflictException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
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

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly defaultAdminUsername = process.env.ADMIN_USERNAME ?? 'admin';
  private readonly defaultAdminPassword = process.env.ADMIN_PASSWORD ?? 'admin123456';
  private readonly saltRounds = this.parseSaltRounds(
    process.env.BCRYPT_SALT_ROUNDS,
  );

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    const adminExists = await this.prisma.user.findUnique({
      where: { username: this.defaultAdminUsername },
    });

    if (adminExists) {
      return;
    }

    const passwordHash = await bcrypt.hash(
      this.defaultAdminPassword,
      this.saltRounds,
    );

    await this.prisma.user.create({
      data: {
        username: this.defaultAdminUsername,
        passwordHash,
        displayName: '系统管理员',
        role: 'admin',
      },
    });
  }

  async login(username: string, password: string): Promise<AuthTokenResponse> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const payload: AdminJwtPayload = {
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

  async verifyToken(token: string): Promise<AdminJwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<AdminJwtPayload>(token);

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('登录态已失效，请重新登录');
      }

      return {
        sub: user.id,
        username: user.username,
        role: user.role,
      };
    } catch {
      throw new UnauthorizedException('登录态已失效，请重新登录');
    }
  }

  async createUser(payload: CreateUserInput): Promise<UserPublic> {
    const exists = await this.prisma.user.findUnique({
      where: { username: payload.username },
    });

    if (exists) {
      throw new ConflictException('用户名已存在');
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

  async listUsers(): Promise<UserPublic[]> {
    const users = await this.prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users.map((user) => this.mapUserPublic(user));
  }

  private mapUserPublic(user: {
    id: number;
    username: string;
    displayName: string | null;
    role: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): UserPublic {
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

  private parseSaltRounds(value?: string): number {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 4 || parsed > 15) {
      return 10;
    }

    return parsed;
  }
}
