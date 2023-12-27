import React, { useEffect, useRef, useState } from 'react'
import css from './styles/styles.module.css'
import useWidth from '@/hooks/useWidth'
import Dropdown from 'react-bootstrap/Dropdown';
import { GiHamburgerMenu } from "react-icons/gi";


const NavBar:React.FC = () => {

    const width = useWidth()
    const [show, setShow] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleToggle = (isOpen:boolean) => {
        setShow(isOpen);
    };

    const handleFocusOut = (event:any) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.relatedTarget)) {
            setShow(false);
        }
    };
    

    useEffect(() => {
        document.addEventListener("focusout", handleFocusOut);
        return () => {
            document.removeEventListener("focusout", handleFocusOut);
        };
    }, []);
    
    return (
        <div className={css.wrapper}>
            {width! < 768 ? 
            <Dropdown>
                <Dropdown.Toggle onToggle={handleToggle} ref={dropdownRef} className={css.dropdownButton}>
                    <GiHamburgerMenu className={css.hamburgerMenu}/>
                </Dropdown.Toggle>
                <Dropdown.Menu className={css.mobileMenuBackground}>
                    <Dropdown.Item className={css.dropdownItem} href="/">BLOG</Dropdown.Item>
                    <Dropdown.Item className={css.dropdownItem} href="/about">ABOUT</Dropdown.Item>
                    <Dropdown.Item className={css.dropdownItem} href="/contact">CONTACT</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            
             :
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