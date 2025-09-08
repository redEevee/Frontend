import './App.css'
import Layout from "./shared/components/layouts/Layout.tsx";
import Router from "./shared/routers/Router.tsx";

function App() {
    return (
        <>
            <Layout>
                <Router/>
            </Layout>
        </>
    )
}

export default App
