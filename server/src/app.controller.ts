import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppService, type SiteContent, type SiteContentInput } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import {
  AuthService,
  type AuthTokenResponse,
  type CreateUserInput,
  type UserPublic,
} from './auth/auth.service';

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

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return this.appService.getHealth();
  }

  @Get('public/site-content')
  async getSiteContent(): Promise<SiteContent> {
    return this.appService.getSiteContent();
  }

  @Post('admin/auth/login')
  async login(@Body() payload: LoginRequest): Promise<AuthTokenResponse> {
    return this.authService.login(payload.username, payload.password);
  }

  @Get('admin/users')
  @UseGuards(AuthGuard)
  async listUsers(): Promise<UserPublic[]> {
    return this.authService.listUsers();
  }

  @Post('admin/users')
  @UseGuards(AuthGuard)
  async createUser(
    @Body() payload: CreateUserInput,
    @Req() request: RequestWithUser,
  ): Promise<UserPublic> {
    if (request.user?.role !== 'admin') {
      throw new ForbiddenException('只有管理员可以创建账号');
    }

    return this.authService.createUser(payload);
  }

  @Get('admin/site-content')
  @UseGuards(AuthGuard)
  async getAdminSiteContent(): Promise<SiteContent> {
    return this.appService.getSiteContent();
  }

  @Put('admin/site-content')
  @UseGuards(AuthGuard)
  async updateSiteContent(
    @Body() payload: SiteContentInput,
    @Req() request: RequestWithUser,
  ): Promise<SiteContent> {
    const operator = request.user?.username ?? 'unknown';
    return this.appService.updateSiteContent(payload, operator);
  }
}
