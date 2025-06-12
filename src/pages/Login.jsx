import {React, useState} from 'react';
import {NavLink} from 'react-router-dom';

import Logo from '../assets/logo.png';


const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        // Handle login logic here
    };

    return (
        <>
         <div className="container login-logo">
           <NavLink to="/">
             <img src={Logo} alt="themchar ai" width="221" />
           </NavLink>
         </div>

          <div className="container">
          
            <div className="login-container">
                <h2>Login</h2>
                <p>Please enter your credentials to continue.</p>
                <br className="mt-1" />
                
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button className="mt-2 btn-primary" onClick={handleLogin}>Login</button>
                <p className="mt-1">Don't have an account? <NavLink to="/register"><span className="link">Register</span></NavLink></p>
            </div>
        </div>
        </>
    
    );
};
export default Login;