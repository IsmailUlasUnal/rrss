import type {Metadata} from "next";
import {AntdRegistry} from "@ant-design/nextjs-registry";
import './globals.css'
import {ConfigProvider} from "antd";
import {theme} from "@/lib/theme";
import ReduxProvider from "@/components/Redux/ReduxProvider";

export const metadata: Metadata = {
    title: "Create Next App", description: "Generated by create next app",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <AntdRegistry>
                    <ConfigProvider theme={theme}>
                        <ReduxProvider>
                            {children}
                        </ReduxProvider>
                    </ConfigProvider>
                </AntdRegistry>
            </body>
        </html>
    );
}
