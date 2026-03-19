import { cx } from "@/utils/cx";
import { HeaderLayout } from "@/layouts/header-layout";

const Image = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
    return (
        <div className={cx("flex flex-col gap-2", className)}>
            <img src={src} alt={alt} className="rounded-lg" />
            <span className="text-sm text-secondary">{alt}</span>
        </div>
    );
};

export const AboutScreen = () => {
    return (
        <HeaderLayout>
            <div className="mt-16 flex w-full flex-col items-center gap-6 px-4 mx-auto lg:w-1/2">
                <h1 className="py-16 text-center text-display-lg font-semibold text-primary">About Me</h1>
                <Image src="/images/me.jpeg" alt="Me rock climbing at smith rock" className="mx-auto" />
                <p className="text-lg w-full">
                    I'm a software engineer with a passion for building web applications that are fast, responsive, and easy to use.
                    I have a strong background in web development, and laboratory automation. 
                    I've been having a lot of fun orchestrating agentic workflows recently.
                </p>
            </div>
        </HeaderLayout>
    );
};
