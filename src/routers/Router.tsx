import "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../landing/pages/Home.tsx";

function Router() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default Router;