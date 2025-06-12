import {React} from 'react';
import {NavLink} from 'react-router-dom';

const Home = () => {
    return(
        <>
            <div className="home flex">
                <div>
                    <h1>
                        Your wellbeing
                        <br />
                        <b>Companion</b><span>.</span>
                    </h1>
                    <p className="mt-1">AI-powered stress and depression detection chatbot for university students.</p>
                    <NavLink to="/chat">
                        <button className="start-chat"> Start Chat</button>
                    </NavLink>
                </div>
            </div>
            
            {/* footer */}
            <footer>
            <p>Designed & Developed By: <br/> <b>STUDENT:</b> Mwenge Corlinus. |  <b>ID:</b> 2404433989</p>
            </footer>
        </>
    )
}

export default Home;