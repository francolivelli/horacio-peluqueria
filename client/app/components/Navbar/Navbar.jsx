import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import logo from "app/assets/horacioLogoRed.png";
import { AiOutlineCalendar, AiOutlineClockCircle } from "react-icons/ai";
import { VscTriangleRight } from "react-icons/vsc";
import { BsScissors } from "react-icons/bs";
import { IoIosPerson } from "react-icons/io";
import { HiOutlineClipboardList } from "react-icons/hi";
import styles from "./Navbar.module.css";

function NavItem({ path, text, icon, active }) {
  const router = useRouter();
  const currentPath = usePathname();

  const handleClick = () => {
    if (currentPath !== path) {
      router.push(path);
    }
  };

  return (
    <>
      <div
        className={active ? styles.navbar__itemActive : styles.navbar__item}
        onClick={handleClick}>
        <div className={styles.navbar__itemName}>
          {icon}
          {text}
        </div>
        <VscTriangleRight className={styles.navbar__itemIcon} />
      </div>
      <hr className={styles.navbar__divider} />
    </>
  );
}

function Navbar({ onNavItemClick }) {
  return (
    <div className={styles.navbar}>
      <Image
        src={logo}
        alt="Logo"
        className={styles.navbar__logo}
        priority={true}
      />
      <div className={styles.navbar__items}>
        <NavItem
          path="/"
          text="Disponibilidad"
          icon={<AiOutlineClockCircle className={styles.navbar__itemIcon} />}
          active={usePathname() === "/"}
          onNavItemClick={onNavItemClick}
        />
        <NavItem
          path="/book"
          text="Reservar"
          icon={<AiOutlineCalendar className={styles.navbar__itemIcon} />}
          active={usePathname() === "/book"}
          onNavItemClick={onNavItemClick}
        />
        <NavItem
          path="/appointments"
          text="Turnos"
          icon={<HiOutlineClipboardList className={styles.navbar__itemIcon} />}
          active={usePathname() === "/appointments"}
          onNavItemClick={onNavItemClick}
        />
        <NavItem
          path="/services"
          text="Servicios"
          icon={<BsScissors className={styles.navbar__itemIcon} />}
          active={usePathname() === "/services"}
          onNavItemClick={onNavItemClick}
        />
        <NavItem
          path="/hairdressers"
          text="Peluqueros"
          icon={<IoIosPerson className={styles.navbar__itemIcon} />}
          active={usePathname() === "/hairdressers"}
          onNavItemClick={onNavItemClick}
        />
      </div>
    </div>
  );
}

export default Navbar;
