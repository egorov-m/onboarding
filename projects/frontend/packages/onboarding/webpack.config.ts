import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";
import "webpack-dev-server";

type Mode = "development" | "production";

interface EnvVariables {
  mode: Mode;
  port?: number;
}

module.exports = (env: EnvVariables) => {
  const isDev = env.mode === "development";

  const config: webpack.Configuration = {
    entry: path.resolve(__dirname, "src", "index.tsx"),
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "[name].[contenthash].js",
      clean: true,
      publicPath: "",
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
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "public", "index.html"),
      }),
      new webpack.ProgressPlugin(),
      new webpack.DefinePlugin({
        "process.env.REACT_APP_SERVER_PATH_PREFIX": JSON.stringify(
          process.env.REACT_APP_SERVER_PATH_PREFIX || "/"
        ),
      }),
    ],
    devtool: isDev ? "inline-source-map" : false,
    devServer: isDev
      ? {
          port: env.port || 3000,
          historyApiFallback: true,
          open: true,
          hot: true,
          static: {
            directory: path.resolve(__dirname, "public"),
          },
        }
      : undefined,
    mode: env.mode || "development",
  };

  return config;
};
