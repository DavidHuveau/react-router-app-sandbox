import { createCookie } from "react-router";

const visitorCookie = createCookie("visitor-cookie", {
  maxAge: 60 * 5, // 5 minutes
  path: "/",
  sameSite: "lax",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
});

type VisitorCookieData = {
  redirectUrl?: string;
};

// This cookie is used to persist the URL a visitor intended to visit before being redirected to the login page
export async function getVisitorCookieData(request: Request): Promise<VisitorCookieData> {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = await visitorCookie.parse(cookieHeader);
  return cookie && cookie.redirectUrl ? cookie : { redirectUrl: undefined };
}

export async function setVisitorCookieData(data: VisitorCookieData, headers = new Headers()): Promise<Headers> {
  const cookie = await visitorCookie.serialize(data);
  headers.append("Set-Cookie", cookie);
  return headers;
}
