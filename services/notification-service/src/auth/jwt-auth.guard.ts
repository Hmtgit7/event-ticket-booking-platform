import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify, JsonWebTokenError } from 'jsonwebtoken';
import { Request } from 'express';

interface JwtPayload {
  sub: string;
  email?: string;
  roles?: string[];
}

export interface AuthenticatedRequest extends Request {
  userId: string;
}

/**
 * Verify-only, same as every other service - notification-service never
 * issues tokens, it only checks ones auth-service signed. JWT_SECRET must be
 * byte-for-byte identical across every service (see .env.example).
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const header = request.headers.authorization;

    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const token = header.slice(7);
    const secret = this.configService.get<string>('JWT_SECRET');

    try {
      const payload = verify(token, secret as string) as JwtPayload;
      request.userId = payload.sub;
      return true;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid or expired token');
      }
      throw error;
    }
  }
}
