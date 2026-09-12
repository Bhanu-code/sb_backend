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
              state: user.profile.state,
              district: user.profile.district,
              maritalStatus: user.profile.maritalStatus,
              physicalStatus: user.profile.physicalStatus,
              profileCreatedBy: user.profile.profileCreatedBy,
              employmentType: user.profile.employmentType,
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
              partnerHeightMin: user.profile.partnerHeightMin,
              partnerHeightMax: user.profile.partnerHeightMax,
              partnerReligion: user.profile.partnerReligion,
              partnerCaste: user.profile.partnerCaste,
              partnerMotherTongue: user.profile.partnerMotherTongue,
              partnerMaritalStatus: user.profile.partnerMaritalStatus,
              partnerEducationLevel: user.profile.partnerEducationLevel,
              partnerOccupationCategory: user.profile.partnerOccupationCategory,
              partnerEmploymentType: user.profile.partnerEmploymentType,
              partnerState: user.profile.partnerState,
              partnerDistrict: user.profile.partnerDistrict,
              partnerEatingHabit: user.profile.partnerEatingHabit,
              partnerSmokingHabit: user.profile.partnerSmokingHabit,
              partnerDrinkingHabit: user.profile.partnerDrinkingHabit,
              partnerPhysicalStatus: user.profile.partnerPhysicalStatus,
              partnerFamilyStatus: user.profile.partnerFamilyStatus,
              partnerFamilyValue: user.profile.partnerFamilyValue,
              partnerFamilyType: user.profile.partnerFamilyType,
              partnerDosham: user.profile.partnerDosham,
              partnerNakshatra: user.profile.partnerNakshatra,
              idDocumentType: user.profile.idDocumentType,
              idVerificationStatus: user.profile.idVerificationStatus,
              idVerificationRejectionReason: user.profile.idVerificationRejectionReason,
            }
          : null,
      }}
    />
  );
}