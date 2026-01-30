import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Request } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { DecodedIdToken } from 'firebase-admin/auth';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      if (admin.apps.length === 0) {
        this.initializeFirebaseAdmin();
      }

      ((request as unknown) as {
        user: DecodedIdToken;
      }).user = await admin.auth().verifyIdToken(token);
      return true;
    } catch (error) {
      console.error('Auth error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private initializeFirebaseAdmin() {
    // Try to use service account file first
    const serviceAccountPath = path.join(
      __dirname,
      '../..',
      'firebase-service-account.json',
    );

    if (fs.existsSync(serviceAccountPath)) {
      console.log('Initializing Firebase Admin with service account file');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
      });
    } else if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ) {
      // Use environment variables
      console.log('Initializing Firebase Admin with environment variables');
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      throw new Error(
        'Firebase Admin credentials not found. Please provide either a firebase-service-account.json file or set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables.',
      );
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
