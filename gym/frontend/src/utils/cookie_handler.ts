/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {User} from "./types"
import Cookies from 'js-cookie';
type raw_cookie = string | boolean
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

  parseCookieToUser(cookie: string): User | undefined{
      try {
    const user: User = JSON.parse(cookie);
    return user;
  } catch (error) {
    return undefined;
  }
  }
  redirectToLoginIfNoCookie(cookie: string | boolean, path = "/login"): void {
  if (!cookie) {
    window.location.href = path;
    return undefined;
    }
  }
  
  extract_cookie(name:string){
    const cookie_string: raw_cookie = this.checkForCookie(name);
    this.redirectToLoginIfNoCookie(cookie_string);
    const cookie: User | undefined = typeof (cookie_string) =='string' ? (this.parseCookieToUser(cookie_string)) : undefined;
    return cookie;
  }
}
