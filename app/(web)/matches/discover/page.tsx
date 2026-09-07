// app/api/matches/discover/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function calculateAge(dob: Date): number {
  return Math.floor(
    (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
  );
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") ?? "recommended";

    const me = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!me) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingInterests = await prisma.interest.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      select: { senderId: true, receiverId: true },
    });
    const interactedIds = new Set(
      existingInterests.flatMap((i) => [i.senderId, i.receiverId]),
    );
    interactedIds.add(userId);

    const blocks = await prisma.block.findMany({
      where: { OR: [{ blockerId: userId }, { blockedId: userId }] },
      select: { blockerId: true, blockedId: true },
    });
    const blockedIds = new Set(
      blocks.flatMap((b) => [b.blockerId, b.blockedId]),
    );

    const excludeIds = [...new Set([...interactedIds, ...blockedIds])];

    const now = new Date();
    let dobGte: Date | undefined;
    let dobLte: Date | undefined;

    if (me.profile?.partnerAgeMax) {
      dobGte = new Date(now);
      dobGte.setFullYear(now.getFullYear() - me.profile.partnerAgeMax - 1);
    }
    if (me.profile?.partnerAgeMin) {
      dobLte = new Date(now);
      dobLte.setFullYear(now.getFullYear() - me.profile.partnerAgeMin);
    }

    const targetGender =
      me.gender === "MALE"
        ? "FEMALE"
        : me.gender === "FEMALE"
          ? "MALE"
          : undefined;

    // Base filters shared by every category — never bypass these
    const baseWhere = {
      id: { notIn: excludeIds },
      profileComplete: true,
      isActive: true,
      ...(targetGender && { gender: targetGender }),
      ...(dobGte && dobLte && { dateOfBirth: { gte: dobGte, lte: dobLte } }),
    };

    // Category-specific narrowing, layered on top of the base filters
    let categoryProfileWhere: Record<string, any> = { matrimonyVisible: true };
    let orderBy: Record<string, any> = { createdAt: "desc" };

    switch (category) {
      case "nearby":
        if (me.profile?.city) {
          categoryProfileWhere = {
            ...categoryProfileWhere,
            city: me.profile.city,
          };
        } else if (me.profile?.state) {
          categoryProfileWhere = {
            ...categoryProfileWhere,
            state: me.profile.state,
          };
        }
        break;

      case "education":
        if (me.profile?.educationLevel) {
          categoryProfileWhere = {
            ...categoryProfileWhere,
            educationLevel: me.profile.educationLevel,
          };
        }
        break;

      case "professional":
        if (me.profile?.occupationCategory) {
          categoryProfileWhere = {
            ...categoryProfileWhere,
            occupationCategory: me.profile.occupationCategory,
          };
        }
        break;

      case "community":
        if (me.profile?.religion) {
          categoryProfileWhere = {
            ...categoryProfileWhere,
            religion: me.profile.religion,
          };
        }
        // caste stays free text — dropped from equality filter since it's
        // too fragmented to reliably match; religion alone drives this category now
        break;

      case "recommended":
      default:
        if (me.profile?.partnerReligion) {
          categoryProfileWhere = {
            ...categoryProfileWhere,
            religion: me.profile.partnerReligion,
          };
        }
        break;
    }

    const candidates = await prisma.user.findMany({
      where: {
        ...baseWhere,
        profile: categoryProfileWhere,
      },
      include: { profile: true },
      orderBy,
      take: 20,
    });

    const results = candidates
      .filter((c) => c.dateOfBirth && c.profile)
      .map((c) => ({
        id: c.id,
        name: c.fullName ?? "Unknown",
        age: calculateAge(c.dateOfBirth!),
        profession: c.profile?.occupation ?? null,
        location:
          [c.profile?.city, c.profile?.state].filter(Boolean).join(", ") ||
          null,
        religion: c.profile?.religion ?? null, // now returns e.g. "hindu", not "Hindu"
        caste: c.profile?.caste ?? null,
        height: c.profile?.height ?? null,
        education: c.profile?.education ?? null,
        image: c.profile?.avatarUrl ?? null,
      }));

    return NextResponse.json({ profiles: results, category });
  } catch (err) {
    console.error("Discover matches error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
