import { useEffect } from "react";
import styles from "./PasswordWarnings.module.css";

const PasswordWarnings = ({password}) => {
  const rules = [
    {
      id: "uppercase-warning",
      regex: /[A-Z]/,
      messages: ["ABC", "Una letra mayúscula"],
    },
    {
      id: "lowercase-warning",
      regex: /[a-z]/,
      messages: ["abc", "Una letra minúscula"],
    },
    {
      id: "number-warning",
      regex: /[0-9]/,
      messages: ["123", "Un número"],
    },
    {
      id: "length-warning",
      validate: (value) => value.length >= 8,
      messages: ["***", "Mínimo 8 caracteres"],
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      for (const { id, regex, validate, messages } of rules) {
        const element = document.getElementById(id);
        if (password === "") {
          element.style.color = "#6e6e6e";
        } else if (
          (regex && regex.test(password)) ||
          (validate && validate(password))
        ) {
          element.style.color = "#00a541";
        } else {
          element.style.color = "#e53939";
        }
        element.innerHTML = `<p>${messages[0]}</p><p>${messages[1]}</p>`;
      }
    }, 100);
  }, [password]);

  return (
    <div className={styles.warnings}>
      <div className={styles.warnings__header}>
        <p className={styles.warnings__sentence}>
          La contraseña debe contener:
        </p>
        <hr className={styles.divider} />
      </div>
      <div className={styles.warnings__container}>
        <div className={styles.warnings__row}>
          {rules.slice(0, 2).map(({ id }) => (
            <div key={id} className={styles.warnings__column}>
              <div className={styles.warnings__warning} id={id} />
            </div>
          ))}
        </div>
        <div className={styles.warnings__row}>
          {rules.slice(2).map(({ id }) => (
            <div key={id} className={styles.warnings__column}>
              <div className={styles.warnings__warning} id={id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PasswordWarnings;
