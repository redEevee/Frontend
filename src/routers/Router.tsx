import { lazy, Suspense } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../shared/components/layouts/Layout.tsx";

const Home = lazy(() => import("../landing/pages/Home.tsx"));
const PetSns = lazy(() => import("../sns/pages/PetSns.tsx"));

function AppRouter() {
    return (
        <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/sns" element={<PetSns />} />
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

export default AppRouter;
