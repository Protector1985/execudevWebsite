import React from 'react'
import css from './styles/styles.module.css'
import useWidth from '@/hooks/useWidth'
import { GiHamburgerMenu } from "react-icons/gi";
const NavBar:React.FC = () => {

    const width = useWidth()

    
    return (
        <div className={css.wrapper}>
            {width! < 768 ? <GiHamburgerMenu className={css.hamburgerMenu}/> :
            <>
                <a className={css.menuItem}>BLOG</a>
                <a className={css.menuItem}>ABOUT</a>
                <a className={css.menuItem}>CONTACT</a>
            </>
        }
        </div>
    )
}

export default NavBar