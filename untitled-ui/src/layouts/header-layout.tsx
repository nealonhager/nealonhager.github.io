import { Header } from "@/components/marketing/header-navigation/header";

export const HeaderLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex min-h-dvh w-full flex-col mb-16">
            <Header className="shrink-0 border-b border-secondary" items={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }]} />
            {children}
        </div>
    );
};
