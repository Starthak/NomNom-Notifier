import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

const sellerpages = ["/trips", "/reservations", "/properties",];

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const pathname = request.nextUrl.pathname;
  if (sellerpages.some((path) => pathname.startsWith(path))) {
    const token = await getToken({
      req: request,
      secret: process.env.SECRET,
    });
    //console.log(token, "token");

    //check not logged in
    if (!token) {
      const url = new URL(`/403`, request.url);
      return NextResponse.rewrite(url);
    }

    const query = JSON.stringify({
      query: `query {
        VerifySeller(email: "${token.email}")
      }`,
    });

    const response = await fetch(`http://localhost:4003/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Optionally, you might need an authorization header or other headers
      },
      body: query,
    });

    const { data } = await response.json();
    //console.log(data.VerifySeller, "data");
    // check if not authorized
    if (!data.VerifySeller) {
      const url = new URL(`/403`, request.url);
      return NextResponse.rewrite(url);
    }
    return res;
  }
  return res;
}
