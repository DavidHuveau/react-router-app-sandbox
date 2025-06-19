// import { PrismaClient } from "@/generated/prisma/client";
import { PrismaClient } from "@prisma/client";

declare global {
  var __db: PrismaClient | undefined;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.

const db = global.__db || new PrismaClient();

if (process.env.NODE_ENV === "production") {
  global.__db = db;
}

export default db;
