import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import 'webpack-dev-server';
import { config } from 'process';

type Mode = 'development' | 'production';

interface EnvVariables {
    mode: Mode,
    port: number,
}

module.exports = (env: EnvVariables) => {
    const isDev = env.mode === "development";

    const config: webpack.Configuration = {
        entry: path.resolve(__dirname, "src", "index.tsx"),
        output: {
            path: path.resolve(__dirname, "build"),
            filename: "[name].[contenthash].js",
            clean: true,
        },
        module: {
            rules: [
                { test: /\.([cm]?ts|tsx)$/, 
                loader: "ts-loader", 
                exclude: /node_modules/, }
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        plugins: [
            new HtmlWebpackPlugin({ template: path.resolve(__dirname, "public", "index.html") }),
            new webpack.ProgressPlugin(),
          ],
        devtool: isDev ? 'inline-source-map': false, 
        devServer: isDev ? {
            port: env.port ?? 3000,
            open: true,
        }: undefined,

        mode: env.mode ?? "development"
    }
    return config;
};

export default config;