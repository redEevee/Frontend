import './App.css'
import Router from "./routers/Router.tsx";
import Layout from "./shared/components/layouts/Layout.tsx";

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
