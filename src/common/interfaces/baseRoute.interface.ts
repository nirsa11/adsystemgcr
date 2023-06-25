import { Router } from "express";

export interface BaseRoute {
  initRouter(): Router;
  controller: any;
}
