import { NextResponse } from "next/server";
import { getImageKitAuthParams } from "@/lib/imagekit/server";
import { getAdminSession } from "@/app/admin/actions";

/**
 * GET /api/imagekit/auth
 * Generates temporary, signed tokens for direct client-side uploads to ImageKit.
 * Private key remains secure on the server.
 * Requires authenticated admin session.
 */
export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session?.user || session.profile?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Administrator session required." },
        { status: 401 }
      );
    }

    const authParams = getImageKitAuthParams();
    return NextResponse.json(authParams);
  } catch (error: any) {
    console.error("ImageKit auth token error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate ImageKit authentication parameters.",
        details: error?.message || "Check server environment variables.",
      },
      { status: 500 }
    );
  }
}
