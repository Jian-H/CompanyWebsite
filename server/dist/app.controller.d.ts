import { AppService, type SiteContent, type SiteContentInput } from './app.service';
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
    login(payload: LoginRequest): Promise<AuthTokenResponse>;
    listUsers(): Promise<UserPublic[]>;
    createUser(payload: CreateUserInput, request: RequestWithUser): Promise<UserPublic>;
    getAdminSiteContent(): Promise<SiteContent>;
    updateSiteContent(payload: SiteContentInput, request: RequestWithUser): Promise<SiteContent>;
}
export {};
