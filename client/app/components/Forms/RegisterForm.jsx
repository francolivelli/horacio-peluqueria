"use client";
import styles from "./GeneralForm.module.css";
import { MdArrowBack } from "react-icons/md";
import {
  AiOutlineEye,
  AiFillEye,
  AiFillCheckCircle,
  AiFillCloseCircle,
} from "react-icons/ai";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import PasswordWarnings from "../../commons/PasswordWarnings/PasswordWarnings";
import Image from "next/image";
import logo from "app/assets/horacioLogo.jpeg";

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(null);
  const router = useRouter();
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (confirmPassword === "") {
      setPasswordsMatch(null);
    } else if (password === confirmPassword) {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(false);
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    if (user?.role === "client") {
      router.push("/booking/create");
    }
  }, [user]);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const form = event.target;
    const formData = new FormData(form);

    // Valida que las contraseñas coincidan
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Envía la información del usuario al servidor
    axios
      .post(
        "http://localhost:5000/api/users/signup",
        {
          email: formData.get("email"),
          password: password,
        },
        { withCredentials: true }
      )
      .then((response) => {
        // Redirecciona al usuario a la página de inicio de sesión
        setLoading(false);
        router.push("/signin");
      })
      .catch((error) => {
        setLoading(false);
        alert("Ha ocurrido un error al registrar al usuario");
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={`${styles.back} link`} onClick={() => router.back()}>
          <MdArrowBack />
          <p>Atrás</p>
        </div>
        <Image src={logo} alt="Logo" className={styles.logo} />
        <h1 className={styles.title}>Crear cuenta</h1>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className="input__field">
          <label htmlFor="email" className="input__label">
            Mail
          </label>
          <input type="email" name="email" id="email" className="input" />
        </div>
        <div className="input__rowContainer">
          <div className="input__field">
            <label htmlFor="password" className="input__label">
              Contraseña
            </label>
            <input
              name="password"
              id="password"
              className="input"
              type={showPassword ? "text" : "password"}
              style={{ paddingRight: "40px" }}
              onChange={handlePasswordChange}
            />
            <div onClick={togglePasswordVisibility}>
              {showPassword ? (
                <AiFillEye className="input__eye" />
              ) : (
                <AiOutlineEye className="input__eye" />
              )}
            </div>
          </div>
          <div className="input__field">
            <label htmlFor="password" className="input__label">
              Repetir Contraseña
            </label>
            <input
              name="confirmPassword"
              id="confirmPassword"
              className="input"
              type={showConfirmPassword ? "text" : "password"}
              style={{ paddingRight: "50px" }}
              onChange={handleConfirmPasswordChange}
            />
            {confirmPassword !== "" && (
              <div
                className="input__checkCross"
                style={{
                  fontSize: "1rem",
                  right: "35px",
                  color: passwordsMatch ? "#00a541" : "#e53939",
                }}>
                {passwordsMatch ? <AiFillCheckCircle /> : <AiFillCloseCircle />}
              </div>
            )}
            <div onClick={toggleConfirmPasswordVisibility}>
              {showConfirmPassword ? (
                <AiFillEye className="input__eye" />
              ) : (
                <AiOutlineEye className="input__eye" />
              )}
            </div>
          </div>
        </div>
        <PasswordWarnings password={password} />
        <button className={"btn-primary w100"}>
          {loading ? <span className="spinner" /> : "Registrarme"}
        </button>
      </form>
      <hr className={styles.divider} />
      <Link href="/signin">
        <button className={"btn-secondary w100"}>
          ¿Ya tenés cuenta? Iniciá sesión
        </button>
      </Link>
    </div>
  );
}

export default RegisterForm;
