import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "StepFlow - Documentation",
  tagline: "Adapting your customers",
  favicon: "img/favicon.ico",
  url: "https://onboarding-documentation.netlify.app",
  baseUrl: "/",

  organizationName: "onboarding",
  projectName: "onboarding",
  trailingSlash: false,

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  presets: [
    [
      "classic",
      {
        docs: {
          path: "../../../docs",
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.ts"),
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/docusaurus-social-card.jpg",
    docs: {
      sidebar: {
        hideable: true,
      },
    },
    navbar: {
      title: "StepFlow",
      items: [
        { type: "search", position: "right" },
      ],
    },
    footer: {
      style: "dark",
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} Documentation StepFlow Inc`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,

  plugins: [
    [
      require.resolve("@cmfcmf/docusaurus-search-local"),
      {
        style: undefined,
      },
    ],
  ],
};

export default config;
