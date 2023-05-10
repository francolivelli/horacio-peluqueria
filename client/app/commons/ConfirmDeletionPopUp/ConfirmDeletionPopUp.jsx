import React from "react";
import styles from "./ConfirmDeletionPopUp.module.css";
import { IoIosWarning } from "react-icons/io";

const ConfirmDeletionPopUp = ({ hairdresser, onCancel, onConfirm }) => {
  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <IoIosWarning className={styles.icon} />
        <div className={styles.texts}>
          <div className={styles.title}>
            Estás a punto de eliminar a {hairdresser.name}
          </div>
          <div className={styles.text}>¿Deseás confirmar la operación?</div>
        </div>
        <div className={styles.buttons}>
          <button className="btn-secondary w50" onClick={onConfirm}>
            Confirmar
          </button>
          <button className="btn-primary w50" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeletionPopUp;
