// app/(web)/profile/page.tsx
import { redirect } from "next/navigation";
import { getWebSessionUser } from "@/lib/webSession";
import { calculateProfileCompleteness } from "@/lib/profileCompleteness";
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

  const profileCompleteness = calculateProfileCompleteness(user.profile, user.idVerified);

  return (
    <ProfileClient
      initialData={{
        fullName: user.fullName,
        email: user.email,
        emailVerified: user.emailVerified,
        idVerified: user.idVerified,
        age,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString() : null,
        profileCompleteness,
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
              maritalStatus: user.profile.maritalStatus,
              physicalStatus: user.profile.physicalStatus,
              profileCreatedBy: user.profile.profileCreatedBy,
              employmentType: user.profile.employmentType,
              country: user.profile.country,
              citizenship: user.profile.citizenship,
              eatingHabit: user.profile.eatingHabit,
              smokingHabit: user.profile.smokingHabit,
              drinkingHabit: user.profile.drinkingHabit,
              hobbies: user.profile.hobbies,
              familyStatus: user.profile.familyStatus,
              familyValue: user.profile.familyValue,
              familyType: user.profile.familyType,
              horoscopeAvailable: user.profile.horoscopeAvailable,
              horoscopeUrl: user.profile.horoscopeUrl,
              rashi: user.profile.rashi,
              nakshatra: user.profile.nakshatra,
              dosham: user.profile.dosham,
              partnerAgeMin: user.profile.partnerAgeMin,
              partnerAgeMax: user.profile.partnerAgeMax,
              partnerReligion: user.profile.partnerReligion,
              partnerCaste: user.profile.partnerCaste,
              partnerEducationLevel: user.profile.partnerEducationLevel,
              partnerOccupationCategory: user.profile.partnerOccupationCategory,
              partnerCity: user.profile.partnerCity,
              partnerState: user.profile.partnerState,
              partnerHeightMin: user.profile.partnerHeightMin,
              partnerHeightMax: user.profile.partnerHeightMax,
              partnerMotherTongue: user.profile.partnerMotherTongue,
              partnerMaritalStatus: user.profile.partnerMaritalStatus,
              partnerEatingHabit: user.profile.partnerEatingHabit,
              partnerSmokingHabit: user.profile.partnerSmokingHabit,
              partnerDrinkingHabit: user.profile.partnerDrinkingHabit,
              partnerCountry: user.profile.partnerCountry,
              partnerDosham: user.profile.partnerDosham,
              idDocumentType: user.profile.idDocumentType,
              idVerificationStatus: user.profile.idVerificationStatus,
              idVerificationRejectionReason: user.profile.idVerificationRejectionReason,
            }
          : null,
      }}
    />
  );
}