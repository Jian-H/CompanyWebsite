import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  AppService,
  type ArticleInput,
  type HomePageInput,
  type ProductInput,
  type SiteContent,
  type SiteContentInput,
  type SolutionInput,
} from './app.service';
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

  @Get('public/home-page')
  async getPublicHomePage() {
    return this.appService.getPublicHomePage();
  }

  @Get('public/articles/:id')
  async getPublicArticle(@Param('id') id: string) {
    const articles = await this.appService.listArticles();
    return articles.find((article) => article.id === Number(id) && article.isPublished) ?? null;
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

  @Get('admin/home-page')
  @UseGuards(AuthGuard)
  async getAdminHomePage() {
    return this.appService.getAdminHomePage();
  }

  @Put('admin/home-page')
  @UseGuards(AuthGuard)
  async updateHomePage(
    @Body() payload: HomePageInput,
    @Req() request: RequestWithUser,
  ) {
    const operator = request.user?.username ?? 'unknown';
    return this.appService.updateHomePage(payload, operator);
  }

  @Get('admin/products')
  @UseGuards(AuthGuard)
  listProducts() {
    return this.appService.listProducts();
  }

  @Post('admin/products')
  @UseGuards(AuthGuard)
  createProduct(@Body() payload: ProductInput, @Req() request: RequestWithUser) {
    return this.appService.createProduct(payload, request.user?.username ?? 'unknown');
  }

  @Put('admin/products/:id')
  @UseGuards(AuthGuard)
  updateProduct(
    @Param('id') id: string,
    @Body() payload: ProductInput,
    @Req() request: RequestWithUser,
  ) {
    return this.appService.updateProduct(Number(id), payload, request.user?.username ?? 'unknown');
  }

  @Delete('admin/products/:id')
  @UseGuards(AuthGuard)
  deleteProduct(@Param('id') id: string) {
    return this.appService.deleteProduct(Number(id));
  }

  @Get('admin/solutions')
  @UseGuards(AuthGuard)
  listSolutions() {
    return this.appService.listSolutions();
  }

  @Post('admin/solutions')
  @UseGuards(AuthGuard)
  createSolution(@Body() payload: SolutionInput, @Req() request: RequestWithUser) {
    return this.appService.createSolution(payload, request.user?.username ?? 'unknown');
  }

  @Put('admin/solutions/:id')
  @UseGuards(AuthGuard)
  updateSolution(
    @Param('id') id: string,
    @Body() payload: SolutionInput,
    @Req() request: RequestWithUser,
  ) {
    return this.appService.updateSolution(Number(id), payload, request.user?.username ?? 'unknown');
  }

  @Delete('admin/solutions/:id')
  @UseGuards(AuthGuard)
  deleteSolution(@Param('id') id: string) {
    return this.appService.deleteSolution(Number(id));
  }

  @Get('admin/articles')
  @UseGuards(AuthGuard)
  listArticles() {
    return this.appService.listArticles();
  }

  @Post('admin/articles')
  @UseGuards(AuthGuard)
  createArticle(@Body() payload: ArticleInput, @Req() request: RequestWithUser) {
    return this.appService.createArticle(payload, request.user?.username ?? 'unknown');
  }

  @Put('admin/articles/:id')
  @UseGuards(AuthGuard)
  updateArticle(
    @Param('id') id: string,
    @Body() payload: ArticleInput,
    @Req() request: RequestWithUser,
  ) {
    return this.appService.updateArticle(Number(id), payload, request.user?.username ?? 'unknown');
  }

  @Delete('admin/articles/:id')
  @UseGuards(AuthGuard)
  deleteArticle(@Param('id') id: string) {
    return this.appService.deleteArticle(Number(id));
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
