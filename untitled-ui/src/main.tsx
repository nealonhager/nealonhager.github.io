import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router";
import { HomeScreen } from "@/pages/home-screen";
import { AboutScreen } from "@/pages/about-screen";
import { NotFound } from "@/pages/not-found";
import { RouteProvider } from "@/providers/router-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "@/styles/globals.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <HashRouter>
                <RouteProvider>
                    <Routes>
                        <Route path="/" element={<HomeScreen />} />
                        <Route path="/about" element={<AboutScreen />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </RouteProvider>
            </HashRouter>
        </ThemeProvider>
    </StrictMode>,
);
