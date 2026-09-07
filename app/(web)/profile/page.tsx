// app/(web)/profile/page.tsx
import { redirect } from "next/navigation";
import { getWebSessionUser } from "@/lib/webSession";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const user = await getWebSessionUser();
  if (!user) redirect("/login");
  if (!user.profileComplete) redirect("/onboarding");

  const age = user.dateOfBirth
    ? Math.floor(
        (Date.now() - new Date(user.dateOfBirth).getTime()) /
          (365.25 * 24 * 60 * 60 * 1000),
      )
    : null;

  return (
    <ProfileClient
      initialData={{
        fullName: user.fullName,
        email: user.email,
        emailVerified: user.emailVerified,
        age,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString() : null,
        profile: user.profile
          ? {
              bio: user.profile.bio,
              avatarUrl: user.profile.avatarUrl,
              coverUrl: user.profile.coverUrl,
              height: user.profile.height,
              religion: user.profile.religion,
              caste: user.profile.caste,
              motherTongue: user.profile.motherTongue,
              education: user.profile.education,
              educationLevel: user.profile.educationLevel,
              occupation: user.profile.occupation,
              occupationCategory: user.profile.occupationCategory,
              annualIncome: user.profile.annualIncome,
              city: user.profile.city,
              state: user.profile.state,
              partnerAgeMin: user.profile.partnerAgeMin,
              partnerAgeMax: user.profile.partnerAgeMax,
              partnerReligion: user.profile.partnerReligion,
              partnerCaste: user.profile.partnerCaste,
            }
          : null,
      }}
    />
  );
}
