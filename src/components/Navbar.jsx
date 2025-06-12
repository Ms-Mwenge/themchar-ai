import {React} from 'react';
import Logo from '../assets/logo.png'; 
import {NavLink} from 'react-router-dom';

const Navbar = () => {
    return(
       <nav className="flex">
         <div className="logo">
            <img src={Logo} alt="themchar ai" width="221" />
         </div>
         <div className="nav-links flex column-gap">
            <div className="buttons flex column-gap">
                {/* <button className="btn-secondary">Submit Feedback</button> */}
                <NavLink to="/login" className="btn-primary">Login</NavLink>
            </div>
         </div>
       </nav>
    )
}
export default Navbar;