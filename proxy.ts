import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();

  const accessToken =
    cookieStore.get("accessToken")?.value;

  const refreshToken =
    cookieStore.get("refreshToken")?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!accessToken) {
    if (refreshToken) {
      try {
        const response = await checkSession();

        const setCookie =
          response.headers["set-cookie"];

        const nextResponse = NextResponse.next();

        if (setCookie) {
          const cookiesArray = Array.isArray(setCookie)
            ? setCookie
            : [setCookie];

          cookiesArray.forEach((cookieString) => {
            const [cookiePart] =
              cookieString.split(";");

            const [name, value] =
              cookiePart.split("=");

            nextResponse.cookies.set(
              name,
              value,
              {
                httpOnly: true,
                path: "/",
              }
            );
          });
        }

        if (isPublicRoute) {
          return NextResponse.redirect(
            new URL("/", request.url)
          );
        }

        return nextResponse;
      } catch {
        if (isPrivateRoute) {
          return NextResponse.redirect(
            new URL("/sign-in", request.url)
          );
        }
      }
    }

    if (isPrivateRoute) {
      return NextResponse.redirect(
        new URL("/sign-in", request.url)
      );
    }

    return NextResponse.next();
  }

  if (isPublicRoute) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/notes/:path*",
    "/sign-in",
    "/sign-up",
  ],
};