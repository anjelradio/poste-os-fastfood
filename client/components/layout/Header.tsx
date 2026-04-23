"use client";
import { LogOut, Menu, User } from "lucide-react";
import Image from "next/image";
import { FloatingMenu } from "../ui/FloatingMenu";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/appStore";
import { logoutUser } from "@/features/authentication/presentation/actions/authentication/logout-user-action";
import AppAlertModal from "@/features/shared/components/modals/AppAlertModal";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const router = useRouter();
  const { user, clearUser, logout } = useAppStore();

  const canOpenFloatingMenu = user?.role === "CAJA" || user?.role === "COCINA";

  const handleLogout = async () => {
    const result = await logoutUser();
    if (!result.ok) {
      return false;
    }

    logout();
    clearUser();
    router.replace("/login");
    router.refresh();
    return true;
  };

  return (
    <header className="py-10">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600 opacity-30 blur-lg" />

        {/* Header Content */}
        <div
          className="relative rounded-2xl border-2 border-transparent overflow-visible"
          style={{
            background: `linear-gradient(rgba(42, 46, 53, 0.8), rgba(42, 46, 53, 0.8)) padding-box, linear-gradient(to right, #fbbf24, #f97316, #ea580c) border-box`,
            border: "2px solid transparent",
          }}
        >
          {/* Header Background Image */}
          <div
            className="absolute inset-0 opacity-50 rounded-2xl"
            style={{
              backgroundImage: `url(/assets/background-header.png)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <div
            className="relative flex items-center justify-between px-6"
            style={{
              paddingTop: "0.83rem",
              paddingBottom: "0.83rem",
            }}
          >
            {/* Left side - Logo on mobile, empty on desktop */}
            <div className="lg:w-12">
              <div className="flex-shrink-0 relative -my-16 lg:hidden">
                <Image
                  src="/assets/logo.png"
                  alt="Los Porteños"
                  width={114}
                  height={114}
                  className="object-contain transition-all duration-300"
                  style={{
                    filter: "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.8))",
                    marginLeft: "-1rem",
                  }}
                  priority
                />
              </div>
            </div>

            {/* Center - Logo on desktop only */}
            <div className="hidden lg:flex flex-shrink-0 relative -my-16">
              <Image
                src="/assets/logo.png"
                alt="Los Porteños"
                width={114}
                height={114}
                className="object-contain transition-all duration-300"
                style={{
                  filter: "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.8))",
                }}
              />
            </div>

            {/* Right side - Icons */}
            <div className="flex items-center gap-4 relative">
              <Link
                href={"/perfil"}
                className="text-gray-300 transition-all hover:text-orange-400"
              >
                <User className="h-6 w-6" />
              </Link>

              <button
                type="button"
                onClick={() => setLogoutOpen(true)}
                className="text-gray-100 transition-all hover:text-orange-400"
                aria-label="Cerrar sesión"
              >
                <LogOut className="h-6 w-6" />
              </button>

              {canOpenFloatingMenu ? (
                <FloatingMenu
                  open={menuOpen}
                  onOpenChange={setMenuOpen}
                  role={user.role}
                  trigger={
                    <button className="text-gray-300 transition-all hover:text-orange-400">
                      <Menu className="h-6 w-6" />
                    </button>
                  }
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <AppAlertModal
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="Confirmar salida"
        description="Vas a cerrar tu sesión actual en este dispositivo."
        confirmText="Cerrar sesión"
        confirmPendingText="Cerrando sesión..."
        onConfirm={handleLogout}
      />
    </header>
  );
}
