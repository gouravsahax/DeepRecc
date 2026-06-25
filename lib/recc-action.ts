"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { updateTag, unstable_cache } from "next/cache";
import { uploadImage } from "./cloudinary";

const getCachedAllRecs = unstable_cache(
  async (uid?: string) => {
    return await prisma.recc.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        url: true,
        imageUrl: true,
        type: true,
        likeCount: true,
        createdAt: true,
        userId: true,

        user: {
          select: {
            name: true,
          },
        },
        likes: uid
          ? {
              where: { userId: uid },
              select: { userId: true },
            }
          : false,
      },
    });
  },
  ["all-reccs"],
  {
    tags: ["reccs"],
    revalidate: 3600,
  }
);

const getCachedMyReccs = unstable_cache(
  async (userId: string) => {
    const [reccs, user] = await Promise.all([
      prisma.recc.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          reccCount: true,
        },
      }),
    ]);

    return {
      reccs,
      count: user?.reccCount ?? 0,
    };
  },
  ["my-reccs"],
  {
    tags: ["reccs", "profile"],
    revalidate: 3600,
  }
);

export async function createRecc(data: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const title = String(data.get("title") ?? "").trim();
  const desc = String(data.get("desc") ?? "").trim();
  const url = String(data.get("url") ?? "").trim();
  const type = String(data.get("type") ?? "").trim();
  const imageFile = data.get("image") as File | null;

  if (!title || !url || !type) {
    throw new Error("Missing required fields");
  }

  let imageUrl: string | null = null;
  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadImage(imageFile);
  }

  await prisma.$transaction(
    async (tx) => {
      await tx.recc.create({
        data: {
          title,
          description: desc,
          url,
          imageUrl,
          type,
          userId: session.user.id,
        },
      });
      await tx.user.update({
        where: { id: session.user.id },
        data: { reccCount: { increment: 1 } },
      });
    },
    {
      maxWait: 15000,
      timeout: 20000,
    }
  );
  updateTag("reccs");
  updateTag("profile");
  redirect("/reccs");
}

export async function getAllRecs() {
  const session = await auth();
  const userId = session?.user?.id;
  return getCachedAllRecs(userId || "anonymous");
}

export async function getMyReccs() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return getCachedMyReccs(session.user.id);
}

export async function getARecc(id:string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try{
    const reccData = await prisma.recc.findUnique({
      where : {
        id : id
      }
    })

    if(reccData?.userId !== session.user.id){
      throw new Error("Unauthorized");
    }

    return {title:reccData?.title, desc:reccData?.description}
  } catch {
    throw new Error("")
  }
}

export async function updateRecc(id: string, formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("desc") ?? "").trim();

  if (!title) {
    throw new Error("Title is required");
  }

  const reccData = await prisma.recc.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!reccData) {
    throw new Error("Recommendation not found");
  }

  if (reccData.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.recc.update({
    where: { id },
    data: {
      title,
      description: description || null,
    },
  });

  updateTag("reccs");
  redirect("/reccs");
}

export async function deleteRecc(reccId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const recc = await prisma.recc.findUnique({
    where: { id: reccId },
    select: { id: true, userId: true },
  });

  if (!recc) {
    throw new Error("Recommendation not found");
  }

  if (recc.userId !== session.user.id) {
    throw new Error("Forbidden");
  }

  await prisma.$transaction(
    async (tx) => {
      await tx.recc.delete({
        where: { id: reccId },
      });

      await tx.user.update({
        where: { id: session.user.id },
        data: {
          reccCount: {
            decrement: 1,
          },
        },
      });
    },
    {
      maxWait: 15000,
      timeout: 20000,
    }
  );

  updateTag("reccs");
  updateTag("profile");
}

export async function toggleLike(reccId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_reccId: {
          userId,
          reccId,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_reccId: {
            userId,
            reccId,
          },
        },
      });
      await prisma.recc.update({
        where: { id: reccId },
        data: { likeCount: { decrement: 1 } },
      });
    } else {
      await prisma.like.create({
        data: {
          userId,
          reccId,
        },
      });
      await prisma.recc.update({
        where: { id: reccId },
        data: { likeCount: { increment: 1 } },
      });
    }

    updateTag("reccs");
  } catch (error: any) {
    console.error(error);
    throw new Error(`Failed to toggle like: ${error.message || error}`);
  }
}