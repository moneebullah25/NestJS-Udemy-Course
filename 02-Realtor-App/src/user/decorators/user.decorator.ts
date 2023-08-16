import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserInfo {
  name: string;
  id: number;
  iat: number;
  exp: number;
}

// After interceptor incepts the request and validate and transform the jwt into user object then decorator get the user object from the request and stick it to the endpoint which uses the @User decorator
export const User = createParamDecorator((data, context: ExecutionContext) => {
  // console.log({data}); // undefined
  const request = context.switchToHttp().getRequest();
  return request.user;
});
