import express from "express";

type KeyValues = { [key: string]: string };

export class BaseController {
  private cookies: KeyValues;
  private responseExpress: express.Response;
  constructor(res: express.Response) {
    this.responseExpress = res;
  }

  protected response<T>(response: T) {
    if (this.cookies) {
      for (const [key, value] of Object.entries(this.cookies)) {
        this.responseExpress.cookie(key, value);
      }
    }
    return this.responseExpress.send(response);
  }

  protected next<T>(err: T) {}

  protected withCookies(cookies: KeyValues) {
    this.cookies = cookies;
    return this;
  }
}
