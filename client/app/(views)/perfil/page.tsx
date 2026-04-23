"use client";
import BackButton from "@/components/ui/BackButton";
import Heading from "@/components/ui/Heading";
import ProfileEmailCard from "@/features/users/presentation/components/profile/ProfileEmailCard";
import ProfileInfoCard from "@/features/users/presentation/components/profile/ProfileInfoCard";
import ProfileSecurityCard from "@/features/users/presentation/components/profile/ProfileSecurityCard";

export default function ProfilePage() {
  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <BackButton />
        <Heading>Perfil del Usuario</Heading>
      </div>
      <div className="mt-8 pb-8 space-y-6 max-w-4xl mx-auto px-4">
        <ProfileInfoCard />
        <ProfileEmailCard />
        <ProfileSecurityCard />
      </div>
    </>
  );
}
