import CustomLinkButton from "@/features/shared/components/ui/CustomLinkButton";
import ReturnHeading from "@/features/shared/components/ui/ReturnHeading";
import { GradientCard } from "@/features/shared/components/ui/GradientCard";
import UserListCard from "@/features/users/presentation/components/users/UserListCard";
import UserSearchForm from "@/features/users/presentation/components/users/UserSearchForm";
import { usersRepository } from "@/features/users/data/repositories/users.repository";

export default async function UsersPage() {
  const response = await usersRepository.getUsers();

  if (!response.ok) {
    throw new Error(response.errors[0] ?? "Error al obtener los usuarios.");
  }

  const users = response.data;

  return (
    <div className="flex-1 pb-10">
      <ReturnHeading titlePage="Gestión de Usuarios" backHref="/administracion" />
      <CustomLinkButton
        pageUrl="/administracion/usuarios/agregar"
        label="REGISTRAR USUARIO"
      />

      <UserSearchForm />

      <GradientCard
        gradientId="users-table"
        contentClassName="rounded-2xl overflow-hidden"
        contentStyle={{ maxHeight: "400px" }}
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

        <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
          {users.map((user) => (
            <UserListCard key={user.id} user={user} />
          ))}
        </div>
      </GradientCard>
    </div>
  );
}
