import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";
import "webpack-dev-server";
import {
  Configuration as DevServerConfiguration,
  ProxyConfigArrayItem,
} from "webpack-dev-server";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

type Mode = "development" | "production";

interface EnvVariables {
  mode: Mode;
  port?: number;
}

const DOMAIN_NAME = process.env.DOMAIN_NAME;
const ONBOARDING_WEB_APP_PATH_PREFIX =
  process.env.ONBOARDING_WEB_APP_PATH_PREFIX;

const proxyConfig: ProxyConfigArrayItem[] = [
  {
    context: ["/api"],
    target: DOMAIN_NAME,
    secure: false,
    changeOrigin: true,
    pathRewrite: { "^/api": "" },
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
    logLevel: "debug",
  },
];

module.exports = (env: EnvVariables) => {
  const isDev = env.mode === "development";

  const config: webpack.Configuration = {
    entry: path.resolve(__dirname, "src", "index.tsx"),
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "[name].[contenthash].js",
      clean: true,
      publicPath: ONBOARDING_WEB_APP_PATH_PREFIX,
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/,
          type: "asset/resource",
        },
        {
          test: /node_modules[\/\\]@?reactflow[\/\\].*.js$/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
              plugins: [
                "@babel/plugin-proposal-optional-chaining",
                "@babel/plugin-proposal-nullish-coalescing-operator",
              ],
            },
          },
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "public", "index.html"),
        publicPath: ONBOARDING_WEB_APP_PATH_PREFIX,
      }),
      new webpack.ProgressPlugin(),
      new webpack.DefinePlugin({
        "process.env.ONBOARDING_WEB_APP_PATH_PREFIX": JSON.stringify(
          ONBOARDING_WEB_APP_PATH_PREFIX
        ),
        "process.env": JSON.stringify(process.env),
      }),
    ],
    devtool: isDev ? "inline-source-map" : false,
    devServer: isDev
      ? {
          port: env.port || 3000,
          historyApiFallback: {
            index: `${ONBOARDING_WEB_APP_PATH_PREFIX}/index.html`,
          },
          open: true,
          hot: true,
          static: {
            directory: path.resolve(__dirname, "public"),
            publicPath: ONBOARDING_WEB_APP_PATH_PREFIX,
          },
          allowedHosts: "all",
          proxy: proxyConfig,
          client: {
            webSocketURL: {
              pathname: "/ws",
            },
          },
        }
      : undefined,
    mode: env.mode || "development",
  };

  return config;
};
