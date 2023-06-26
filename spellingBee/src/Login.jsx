import './Login.css';
import PropTypes from 'prop-types';
import { useGoogleLogin } from '@react-oauth/google';
import { useEffect } from 'react';

export default function Login({setUser}) {
    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            setUser(codeResponse);
            sessionStorage.setItem("beeyondCode", JSON.stringify(codeResponse))
            if (document.getElementById('autoLogin').checked) {
                localStorage.setItem("beeyondCode", JSON.stringify(codeResponse))
            }
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(()=>{
        let code = JSON.parse(localStorage.getItem('beeyondCode')) || JSON.parse(sessionStorage.getItem('beeyondCode'));
        if (code) {
            setUser(code)
        }
    }, [])

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
                <section className="loginButtons">
                    <button id='googleLogin' onClick={login}>Login with <i className="bi bi-google"></i>oogle</button>
                    <div><input type="checkbox" id="autoLogin" /><label htmlFor='autoLogin'>&nbsp;Keep me logged in on this device</label></div>
                    <button id='guestLogin' onClick={()=>{
                        setUser('Guest')
                    }}><small>Continue as guest...</small></button>
                </section>
            </div>
        </article>
    )
}

Login.propTypes = {
    setUser: PropTypes.func
}