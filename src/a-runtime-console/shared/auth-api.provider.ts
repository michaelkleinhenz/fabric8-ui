import { OpaqueToken } from '@angular/core';
import { AUTH_API_URL } from 'ngx-login-client';

let authApiUrlFactory = () => {
  return process.env.FABRIC8_AUTH_API_URL;
};

export let authApiUrlProvider = {
  provide: AUTH_API_URL,
  useFactory: authApiUrlFactory
};
