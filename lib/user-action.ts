"use server";

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { updateTag, unstable_cache } from 'next/cache';

const getCachedProfile = unstable_cache(
  async (userId: string) => {
    return await prisma.user.findFirst({
      where: {
        id: userId
      }
    });
  },
  ["user-profile"],
  {
    tags: ["profile"],
    revalidate: 3600,
  }
);

export async function getProfile() {
    const session = await auth();

    if(!session?.user?.id) {
        return null;
    }

    try{
        return await getCachedProfile(session.user.id);
    } catch {
        throw new Error("Error in fetching user data");
    }
}

export async function updateProfileName(formData: FormData) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const name = String(formData.get("name") ?? "").trim();
    if (!name) {
        throw new Error("Name cannot be empty");
    }

    try {
        await prisma.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                name,
            },
        });
        updateTag("profile");
        updateTag("reccs");
    } catch (error) {
        console.error(error);
        throw new Error("Failed to update profile name");
    }
}
