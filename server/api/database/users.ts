import { UserService } from "~/server/services/UserService";
import { H3Event } from "h3";
import type { GoogleUser } from "@/types/interfaces";
import type { DBUser } from "@/types/database";

interface UserQueryParams {
  email?: string;
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    // GET - Find user by email
    if (event.method === "GET") {
      const { email } = getQuery<UserQueryParams>(event);
      console.log(`[API] GET /users - Searching for email:`, email);

      if (!email) {
        console.log(`[API] GET /users - Missing email parameter`);
        throw createError({
          statusCode: 400,
          message: "Email parameter is required",
        });
      }

      const user = await UserService.findByEmail(email);
      console.log(
        `[API] GET /users - Result:`,
        user ? "User found" : "User not found"
      );
      return user;
    }

    // POST - Create user from Google data
    if (event.method === "POST") {
      const body = await readBody<GoogleUser>(event);
      console.log(`[API] POST /users - Creating/updating user:`, body.email);

      if (!body.email || !body.name) {
        throw createError({
          statusCode: 400,
          message: "Email and name are required",
        });
      }

      const existingUser = await UserService.findByEmail(body.email);
      if (existingUser) {
        console.log(`[API] POST /users - User exists, updating:`, existingUser.id);
        return await UserService.update(existingUser.id, {
          name: body.name,
          picture: body.picture,
          last_login: new Date(),
        });
      }

      return await UserService.createFromGoogle(body);
    }

    if (event.method === "PATCH") {
      const body = await readBody<Partial<DBUser>>(event);

      if (!body.id) {
        throw createError({
          statusCode: 400,
          message: "User ID is required",
        });
      }

      return await UserService.update(body.id, body);
    }

    throw createError({
      statusCode: 405,
      message: "Method not allowed",
    });
  } catch (error: any) {
    console.error(`[API] Error in /users:`, error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
});
