import { FaPhoneAlt, FaFacebookF, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";
import Icon from '../assets/images/tanager.png';
import { NavLink, useNavigate } from 'react-router-dom'

export const NavigationBar = () => {
    const navigator = useNavigate()

    return (
        <nav className="NavigationBar">
            <div className="topContect widthControl">
                <div className="contectDetails"><FaPhoneAlt /> Frontdesk - +91 2598 84 14 555</div>
                <div className="socialIcons">
                    <FaFacebookF className="icon" />
                    <FaTwitter className="icon" />
                    <FaYoutube className="icon" />
                    <FaInstagram className="icon" />
                </div>
            </div>
            <div className="NavContent widthControl">
                <div className="logoBox" onClick={() => navigator('/')}>
                    <img src={Icon} alt="" height={'40px'} />
                    Tanager Health
                </div>
                <div className="links">
                    <NavLink to='login' className='NavLink'>Login</NavLink>
                    <NavLink to='register' className='NavLink'>Register</NavLink>
                </div>
            </div>
        </nav>
    )
}
