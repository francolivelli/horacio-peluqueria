"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./GeneralForm.module.css";
import axios from "axios";
import { AiFillCheckCircle } from "react-icons/ai";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowMessage(false);

    const response = await axios.post(
      "https://mi-turno-web-api.vercel.app/api/users/forgot-password",
      { email }
    );

    setLoading(false);
    setShowMessage(true);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Recuperar contraseña</h1>
      <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
        <div className="input__field">
          <label className="input__label">Correo electrónico</label>
          <input
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button className={"btn-primary w100"} type="submit" disabled={loading}>
          {loading ? <span className="spinner" /> : "Enviar solicitud"}
        </button>
      </form>
      {showMessage && (
        <section className={styles.messageContainer}>
          <AiFillCheckCircle className={styles.checkIcon} />
          <div>
            <p>Correo electrónico enviado.</p>
            <p>Por favor revise su bandeja de entrada.</p>
          </div>
        </section>
      )}
      <hr className={styles.divider} />
      <Link href="/signin">
        <button className={"btn-secondary w100"}>
          Volver al inicio de sesión
        </button>
      </Link>
    </div>
  );
};

export default ForgotPasswordForm;
