import Header from "./Header.tsx";
import Footer from "./Footer.tsx";
import {Outlet} from "react-router-dom";
import type {ReactNode} from "react";

interface LayoutProps {
    children?: ReactNode;
}

function Layout({children}: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header/>
            <main className="flex-1 bg-gray-50">
                <div className="w-full max-w-7xl mx-auto px-6 py-8">
                    {children || <Outlet />}
                </div>
            </main>
            <Footer/>
        </div>
    );
}

export default Layout;