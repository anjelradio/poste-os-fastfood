"use client";

import type { User } from "@/features/users/domain/entities/user";
import { Edit2 } from "lucide-react";
import Link from "next/link";
import DeleteUser from "./DeleteUser";

type UserListCardProps = {
  user: User;
};

export default function UserListCard({ user }: UserListCardProps) {
  return (
    <>
      <div
        className="hidden md:grid grid-cols-6 gap-4 px-6 py-4 border-b border-gray-600/20 hover:bg-orange-500/5 transition-colors duration-200"
        style={{ background: "transparent" }}
      >
        <div className="text-gray-200">{user.username}</div>
        <div className="text-gray-200">{user.name}</div>
        <div className="text-gray-200">{user.lastName}</div>
        <div className="text-gray-200 truncate">{user.email}</div>
        <div className="text-gray-200">{user.role}</div>
        <div className="flex items-center gap-3">
          <Link
            href={`/administracion/usuarios/${user.id}/editar`}
            className="text-orange-400 transition-colors duration-200 hover:text-orange-300"
          >
            <Edit2 className="h-5 w-5" />
          </Link>
          <DeleteUser
            user={user}
            className="text-red-400 transition-colors duration-200 hover:text-red-300"
          />
        </div>
      </div>

      <div
        className="md:hidden px-6 py-4 border-b border-gray-600/20 hover:bg-orange-500/5 transition-colors duration-200"
        style={{ background: "transparent" }}
      >
        <div className="space-y-2">
          <div className="text-gray-200 font-semibold text-lg">{user.username}</div>
          <div className="text-gray-400 text-sm">
            {user.name} {user.lastName}
          </div>
          <div className="text-gray-300 text-sm">{user.email}</div>
          <div className="text-orange-400 font-bold text-base">{user.role}</div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Link
              href={`/administracion/usuarios/${user.id}/editar`}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 transition-colors duration-200"
            >
              <Edit2 className="h-4 w-4" />
              <span className="text-sm font-medium">Editar</span>
            </Link>
            <DeleteUser
              user={user}
              showLabel
              className="flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-red-400 transition-colors duration-200 hover:bg-red-500/20"
            />
          </div>
        </div>
      </div>
    </>
  );
}
