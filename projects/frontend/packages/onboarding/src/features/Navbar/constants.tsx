import { LogoutIcon } from "shared/ui/icons";

interface NavLink {
  to: string;
  label?: string;
  icon?: React.ReactNode;
  isExternal?: boolean;
}

export const navLinks: NavLink[] = [
  {
    to: "https://onboarding-documentation.netlify.app/",
    label: "Docs",
    isExternal: true,
  },
  { to: "/analyst", label: "Analyst" },
  { to: "/projects", label: "Projects" },
  { to: "#", icon: <LogoutIcon width={20} height={20} /> },
];
