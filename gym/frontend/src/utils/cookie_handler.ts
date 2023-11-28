/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Cookies from 'js-cookie';

interface Cookie {
  token: string;
  username: string;
}

export class CookieHandler {
  getCookie(key: string): Cookie | undefined {
    const cookieString:string | undefined= Cookies.get(key);
    if (cookieString) {
      const cookie: Cookie = JSON.parse(cookieString);
      return cookie;
    }
    return undefined;
  }

  setCookie(key: string, value: string, options: Cookies.CookieAttributes): void {
    Cookies.set(key, value, options);
  }

    redactCookie(key: string, value: string): void {
        Cookies.set(key,value)
  }
  
  checkForCookie(key: string):boolean | string{
    const cookie: string | undefined = Cookies.get(key);
    if (cookie != undefined) {
      return cookie;
    }
    return false;
  }
}
