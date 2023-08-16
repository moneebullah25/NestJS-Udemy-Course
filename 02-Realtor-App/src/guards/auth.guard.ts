import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

interface JWTPayload {
  name: string;
  id: number;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext) {
    // 1. Determine the UserType that can execute the call endpoint
    // Suppose if we pass @Roles(UserType.REALTOR) then roles will be ['REALTOR']
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (roles?.length) {
      // 2. Grab JWT from the request header and verify it
      const request = context.switchToHttp().getRequest();
      const token = request.headers?.authorization?.split('Bearer ')[1];
      try {
        // 3. Verifying the user JWT passed in the header
        const payload = (await jwt.verify(
          token,
          process.env.JSON_TOKEN_KEY,
        )) as JWTPayload;
        
        // 4. Call to database to get the user information
        const user = await this.prismaService.user.findUnique({
          where: {
            id: payload.id,
          },
        });

        if (!user) return false; // If user doesn't exists in the database against the passed JWT
        
        // console.log({user});
        // {
        //   user: {
        //     id: 2,
        //     name: 'Muneeb',
        //     phone: '03214190500',
        //     email: 'moneebullah25@gmail.com',
        //     password: '$2a$10$rjRMEo0lNtF3mXmpAROf7OebqWfP1tYMWyBhIkEtfSkASkfbN6eI6',    
        //     created_at: 2023-07-27T12:50:26.252Z,
        //     updated_at: 2023-07-27T12:50:26.252Z,
        //     user_type: 'REALTOR'
        //   }
        // }

        //@Roles(UserType.REALTOR)
        // roles inside metadata is an array containing the type of user that has the access to that particular endpoint
        if (roles.includes(user.user_type)) return true; // 5. Determine if the user has permission

        return false;
      } catch (error) {
        return false; // jwt fails to verify the auth token
      }
    }

    // return false; // Have to specify roles before every endpoint in the controller and provide the jwt token in the header so that the auth.guard.ts can verify the user accessing the endpoint 
    return true; // If there are no roles then any UserType can access the endpoint 
  }
}
