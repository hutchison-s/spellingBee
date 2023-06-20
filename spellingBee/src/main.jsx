import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <GoogleOAuthProvider clientId='4184924956-cphl1no46q5mur3m86rk83dlg4gb665f.apps.googleusercontent.com'>
    <App />
    </GoogleOAuthProvider>
)
