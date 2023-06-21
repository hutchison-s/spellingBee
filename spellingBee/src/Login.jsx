import './Login.css';
import PropTypes from 'prop-types';
import { useGoogleLogin } from '@react-oauth/google';

export default function Login({setUser}) {
    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {setUser(codeResponse)},
        onError: (error) => console.log('Login Failed:', error)
    });

    

    return (
        <article>
            <div className="logoContainer loginLogo">
                <img className='logoIcon' src="/bee-honey-icon.svg" alt="Beeyond" />
                <h1 className="title">
                    <span className="logoFont">Beeyond</span>
                </h1>
                <h2 className="appFont">WORDS</h2>
            </div>
            <div id="loginOptions">
                <h2>Login to Continue</h2>
                <p>{status}</p>
                <section className="loginButtons">
                    <button onClick={login}>Login <i className="bi bi-google"></i></button>
                    <a onClick={()=>{
                        setUser('Guest')
                    }}><small>Continue as guest...</small></a>
                </section>
            </div>
        </article>
    )
}

Login.propTypes = {
    setUser: PropTypes.func
}