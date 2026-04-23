import { usersRepository } from "@/features/users/data/repositories/users.repository";
import UserListCard from "@/features/users/presentation/components/users/UserListCard";
import UserSearchHeading from "@/features/users/presentation/components/users/UserSearchHeading";
import { GradientCard } from "@/features/shared/components/ui/GradientCard";

export default async function SearchUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ username?: string; role?: string }>;
}) {
  const params = await searchParams;
  const username = params.username || "";
  const role = params.role || "";

  const response = await usersRepository.getUsers({ username, role });

  if (!response.ok) {
    throw new Error(response.errors[0] ?? "Error al obtener los usuarios.");
  }

  return (
    <div className="flex-1 pb-10">
      <UserSearchHeading username={username} role={role} />

      <GradientCard
        gradientId="users-search-table"
        contentClassName="rounded-2xl overflow-hidden"
        contentStyle={{ maxHeight: "900px" }}
      >
        <div className="hidden md:grid grid-cols-6 gap-4 px-6 py-4 border-b border-gray-600/30 sticky top-0">
          <div className="text-gray-300 font-semibold">Usuario</div>
          <div className="text-gray-300 font-semibold">Nombre</div>
          <div className="text-gray-300 font-semibold">Apellido</div>
          <div className="text-gray-300 font-semibold">Correo</div>
          <div className="text-gray-300 font-semibold">Role</div>
          <div className="text-gray-300 font-semibold">Acciones</div>
        </div>

        <div className="md:hidden px-6 py-4 border-b border-gray-600/30 sticky top-0">
          <div className="text-gray-300 font-semibold text-lg">Usuarios</div>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "900px" }}>
          {response.data.map((user) => (
            <UserListCard key={user.id} user={user} />
          ))}
        </div>
      </GradientCard>
    </div>
  );
}
