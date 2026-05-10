import { notFound } from "next/navigation";
import Breadcrumb from "@/features/shared/components/ui/Breadcrumb";
import { usersRepository } from "@/features/users/data/repositories/users.repository";
import EditUserForm from "@/features/users/presentation/components/users/EditUserForm";
import UserForm from "@/features/users/presentation/components/users/UserForm";

export default async function EditUserPage({
  params,
}: {
  params: { id: string };
}) {
  const param = await params;
  const response = await usersRepository.getUserById(+param.id);

  if (!response.ok || !response.data) {
    notFound();
  }

  const user = response.data;

  return (
    <div className="flex-1 pb-10">
      <Breadcrumb
        parent="Gestión de Usuarios"
        child={`Editar ${user.username}`}
        backHref="/administracion/usuarios"
      />
      <EditUserForm>
        <UserForm user={user} />
      </EditUserForm>
    </div>
  );
}
