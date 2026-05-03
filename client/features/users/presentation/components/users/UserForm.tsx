"use client";

import { useState } from "react";
import CustomFieldedFormText from "@/features/shared/components/forms/CustomFieldedFormText";
import CustomSelectForm from "@/features/shared/components/forms/CustomSelectForm";
import type { User } from "@/features/users/domain/entities/user";

function generateSecurePassword() {
  const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const numbers = "23456789";
  const lowercase = "abcdefghijkmnpqrstuvwxyz";

  const requiredChars = [
    uppercase[Math.floor(Math.random() * uppercase.length)],
    uppercase[Math.floor(Math.random() * uppercase.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
  ];

  while (requiredChars.length < 10) {
    requiredChars.push(
      lowercase[Math.floor(Math.random() * lowercase.length)],
    );
  }

  for (let i = requiredChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [requiredChars[i], requiredChars[j]] = [requiredChars[j], requiredChars[i]];
  }

  return requiredChars.join("");
}

export default function UserForm({ user }: { user?: User }) {
  const [generatedPassword, setGeneratedPassword] = useState("");

  const handleGeneratePassword = () => {
    setGeneratedPassword(generateSecurePassword());
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomFieldedFormText
          name="username"
          label="Nombre de usuario"
          defaultValue={user?.username}
          placeholder="Nombre de usuario"
        />

        <CustomFieldedFormText
          name="name"
          label="Nombre"
          defaultValue={user?.name}
          placeholder="Nombre"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomFieldedFormText
          name="lastName"
          label="Apellidos"
          defaultValue={user?.lastName}
          placeholder="Apellidos"
        />

        <CustomFieldedFormText
          type="email"
          name="email"
          label="Correo electrónico"
          defaultValue={user?.email}
          placeholder="correo@ejemplo.com"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <CustomFieldedFormText
          key={`password-${generatedPassword}`}
          type="text"
          name="password"
          label="Contraseña"
          defaultValue={generatedPassword}
          placeholder="Contraseña"
        />

        <button
          type="button"
          onClick={handleGeneratePassword}
          className="w-full rounded-xl border-2 border-gray-600/50 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:border-orange-500/50 hover:bg-orange-500/10"
        >
          GENERAR CONTRASEÑA
        </button>
      </div>

      <CustomSelectForm name="role" label="Role" defaultValue={user?.role}>
        <option value="" className="bg-gray-800">
          Selecciona un rol
        </option>
        <option value="ADMIN" className="bg-gray-800">
          Administración
        </option>
        <option value="CAJA" className="bg-gray-800">
          Caja
        </option>
        <option value="COCINA" className="bg-gray-800">
          Cocina
        </option>
      </CustomSelectForm>
    </>
  );
}
