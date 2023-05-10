"use client";
import Link from "next/link";
import styles from "./GeneralForm.module.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginAsync, selectUser } from "../../features/userSlice";
import { useRouter } from "next/navigation";
import { AiFillCloseCircle, AiFillEye, AiOutlineEye } from "react-icons/ai";
import Image from "next/image";
import logo from "app/assets/horacioLogo.jpeg";

const LoginForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(selectUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [clickedLoginButton, setClickedLoginButton] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(loginAsync({ email, password }));
    setClickedLoginButton(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    if (user) {
      router.push("/");
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user === null && clickedLoginButton) {
      setLoading(false);
      setTimeout(() => {
        setShowError(true);
      }, 3000);
    } else {
      setLoading(false);
      setShowError(false);
    }
  }, [user, loading]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Image src={logo} alt="Logo" className={styles.logo} />
        <h1 className={styles.title}>Iniciar sesión</h1>
      </div>
      <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
        <div className="input__field">
          <label className="input__label">Mail</label>
          <input
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input__field">
          <label className="input__label">Contraseña</label>
          <input
            type={showPassword ? "text" : "password"}
            className="input"
            value={password}
            style={{ paddingRight: "40px" }}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            style={{
              top: "55%",
              right: "10px",
              cursor: "pointer",
            }}
            onClick={togglePasswordVisibility}>
            {showPassword ? (
              <AiFillEye className="input__eye" />
            ) : (
              <AiOutlineEye className="input__eye" />
            )}
          </div>
        </div>
        {showError && (
          <section className={styles.messageContainer}>
            <AiFillCloseCircle className={styles.crossIcon} />
            <div>
              <p>Usuario inexistente o contraseña incorrecta.</p>
            </div>
          </section>
        )}
        <div className={styles.questionContainer}>
          <Link href="/forgot-password">
            <h4 className="link">¿Olvidaste tu contraseña?</h4>
          </Link>
        </div>
        <button className={"btn-primary w100"}>
          {loading ? <span className="spinner" /> : "Ingresar"}
        </button>
      </form>
      <hr className={styles.divider} />
      <Link href="/signup">
        <button className={"btn-secondary w100"}>
          ¿No tenés cuenta? Registrate
        </button>
      </Link>
    </div>
  );
};

export default LoginForm;
