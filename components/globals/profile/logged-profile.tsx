"use client";

import Link from "next/link";
import { LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { AuthUser } from "./types";
import { usePathname, useRouter } from "next/navigation";
import { authTokenStorage } from "@/lib/axios-instance";
import { toast } from "sonner";
import { useGetData } from "@/hooks/use-get-data";

export function LoggedProfile() {
  const router = useRouter();
  const pathname = usePathname();
  const handleLogout = () => {
    authTokenStorage.clearAuthTokens();
    toast.success("Signed out successfully.");
    router.push("/auth/sign-in");
  };
  const { data: meData, isLoading } = useGetData<{ user: AuthUser }>({
    key: ["auth", "me"],
    endpoint: "/auth/me",
    errorMessage: "Failed to load profile data.",
  });
  const user = meData?.user;

  if (!user) {
    return null;
  }

  if (isLoading) {
    return <div>Loading</div>;
  }

  const isInDashboardRoute = pathname.startsWith("/dashboard");
  const role = user.role.slice(0, 1) + user.role.slice(1).toLowerCase();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 rounded-full px-1.5 md:px-2">
          <Avatar size="sm">
            <AvatarImage
              src={user.profile.pictureUrl ?? undefined}
              alt={user.fullName}
            />
            <AvatarFallback>{role}</AvatarFallback>
          </Avatar>
          <div className="hidden md:flex md:flex-col md:items-start md:leading-tight ml-1">
            <span className="text-xs font-medium">{user.fullName}</span>
            <span className="text-[10px] text-muted-foreground  ">{role}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="font-normal md:hidden px-3 py-2 ">
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-sm leading-snug">
              {user.fullName}
            </p>
            <span className="text-[10px] text-muted-foreground  ">{role}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="md:hidden" />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile">
            <UserRound className="h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        {!isInDashboardRoute && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>  
              <Link href="/dashboard">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
          <span className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
