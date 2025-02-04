import { prisma } from "./index";

export async function createApplication(data: {
  projectName: string;
  projectDescription: string;
  whyAttend: string;
  previousWork?: string;
  githubUrl: string;
  canAttendRome: boolean;
  teamMember1Fid: number;
  teamMember1DisplayName: string;
  teamMember1Username: string;
  teamMember1AvatarUrl?: string;
  teamMember2Fid?: number;
  teamMember2DisplayName?: string;
  teamMember2Username?: string;
  teamMember2AvatarUrl?: string;
  teamMember3Fid?: number;
  teamMember3DisplayName?: string;
  teamMember3Username?: string;
  teamMember3AvatarUrl?: string;
}) {
  return prisma.application.create({
    data,
  });
}

export async function getApplicationByFid(fid: number) {
  return prisma.application.findFirst({
    where: {
      teamMember1Fid: fid,
    },
  });
}

export async function getApplications({
  username,
  limit = 10,
  page = 1,
}: {
  username?: string;
  limit?: number;
  page?: number;
}) {
  const skip = (page - 1) * limit;

  const where = username
    ? {
        OR: [
          { teamMember1Username: { contains: username } },
          { teamMember2Username: { contains: username } },
          { teamMember3Username: { contains: username} },
        ],
      }
    : {};

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.application.count({ where }),
  ]);

  return {
    applications,
    total,
    pages: Math.ceil(total / limit),
  };
}
