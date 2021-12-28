import nav_st from '../styles/NavBar.module.css';

export default function Navbar() {
  return (
    <div className={nav_st.topnav} id="myNavbar">
      <a href="/">Inicio</a>
      <a href="#search">Buscar</a>
      <a href="#grade">Calificar</a>
      <a href="#about">Acerca de nosotros</a>
    </div> 
  )
}