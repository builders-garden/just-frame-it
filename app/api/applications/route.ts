import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const projectName = searchParams.get("projectName");

    const skip = (page - 1) * limit;

    const where = projectName
      ? {
          projectName: {
            contains: projectName,
          },
        }
      : {};

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: {
          votes: true,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.application.count({ where }),
    ]);

    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      applications,
      total,
      pages,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
