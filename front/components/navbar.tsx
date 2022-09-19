import Link from 'next/link';
import nav_st from '../styles/NavBar.module.css';

export default function Navbar() {
  return (
    <div className={nav_st.topnav} id="myNavbar">
      <Link href="/">
        <a >Inicio</a>
      </Link>
      <Link href="/add-item">
        <a >Agregar</a>
      </Link>
      <Link href="/#about">
        <a >Acerca de nosotros</a>
      </Link>
    </div> 
  )
}