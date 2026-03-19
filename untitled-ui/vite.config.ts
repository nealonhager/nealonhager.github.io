import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

/**
 * Returns the correct public base path for a GitHub Pages deployment.
 */
function getGithubPagesBase(): string {
    const repository = process.env.GITHUB_REPOSITORY?.split("/")[1];

    if (!repository || repository.endsWith(".github.io")) {
        return "/";
    }

    return `/${repository}/`;
}

export default defineConfig({
    base: getGithubPagesBase(),
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
});
