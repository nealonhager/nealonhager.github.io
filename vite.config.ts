import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

function getGithubPagesBase(): string {
    const repository = process.env.GITHUB_REPOSITORY?.split("/")[1];

    if (!repository || repository.endsWith(".github.io")) {
        return "/";
    }

    return `/${repository}/`;
}

export default defineConfig({
    base: getGithubPagesBase(),
    plugins: [react()],
});
