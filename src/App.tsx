import './App.css'
import Router from "./routers/Router.tsx";
import { AuthProvider } from "./account/hooks/useAuth.tsx";

function App() {
    return (
        <AuthProvider>
            <Router/>
        </AuthProvider>
    )
}

export default App
