import { LogoutIcon } from "shared/ui/icons";

interface NavLink {
  to: string;
  label?: string;
  icon?: React.ReactNode;
}

export const navLinks: NavLink[] = [
  { to: "/", label: "Logo" },
  { to: "/analyst", label: "Analyst" },
  { to: "/projects", label: "Projects" },
  { to: "#", icon: <LogoutIcon width={20} height={20} /> },
];
