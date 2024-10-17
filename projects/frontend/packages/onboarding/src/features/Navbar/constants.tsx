interface NavLink {
  to: string;
  label: string;
}

export const navLinks: NavLink[] = [
  { to: "/", label: "Logo" },
  { to: "/analyst", label: "Analyst" },
  { to: "/projects", label: "Projects" },
  { to: "/logout", label: "Log Out" },
];
