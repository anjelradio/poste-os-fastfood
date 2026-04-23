import Breadcrumb from "@/features/shared/components/ui/Breadcrumb";
import AddUserForm from "@/features/users/presentation/components/users/AddUserForm";
import UserForm from "@/features/users/presentation/components/users/UserForm";

export default function AddUserPage() {
  return (
    <div className="flex-1 pb-10">
      <Breadcrumb parent="Gestión de Usuarios" child="Registrar Usuario" />
      <AddUserForm>
        <UserForm />
      </AddUserForm>
    </div>
  );
}
