import {React, useState} from 'react';
import {NavLink} from 'react-router-dom';

import Logo from '../assets/logo.png';


const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleregister = () => {
        // Handle register logic here
    };

    return (
        <>
         <div className="container register-logo">
           <NavLink to="/">
             <img src={Logo} alt="themchar ai" width="221" />
           </NavLink>
         </div>

          <div className="container">
          
            <div className="register-container">
                <h2>Create Account</h2>
                <p>Please enter your credentials to register.</p>
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
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                />
                <button className="mt-2 btn-primary" onClick={handleregister}>Register</button>
                <p className="mt-1">Already have an account? <NavLink to="/login"><span className="link">Login</span></NavLink></p>
            </div>
        </div>
        </>
    
    );
};
export default Register;