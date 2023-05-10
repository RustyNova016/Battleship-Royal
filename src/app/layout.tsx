import "./globals.css";
import {DynamicBackgroundWithContext} from "@/components/dynamic-background/dynamic-background-with-context";
import {NavBar} from "@/components/nav-bar/nav-bar";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
            <head/>
            <body
                style={{
                    height: "100vh",
                    fontFamily:
                    "'Montserrat', -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,\n" +
                    "    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;",
                }}
            >

                <DynamicBackgroundWithContext>
                    <>
                        <NavBar/>
                        {children}
                    </>
                </DynamicBackgroundWithContext>
            </body>
        </html>
    );
}
