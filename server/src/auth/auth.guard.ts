import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

interface RequestWithUser {
  headers: {
    authorization?: string;
  };
  user?: {
    userId: number;
    username: string;
    role: string;
  };
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('缺少有效的 Bearer Token');
    }

    const token = authHeader.slice(7);
    const payload = await this.authService.verifyToken(token);
    request.user = {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };

    return true;
  }
}
