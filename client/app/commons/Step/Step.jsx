import { AiOutlineCheck } from "react-icons/ai";
import styles from "./Step.module.css";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentStep, setCurrentStep } from "../../features/stepSlice";

const Step = ({ number, active, text }) => {
  const dispatch = useDispatch();
  const currentStep = useSelector(selectCurrentStep);
  const isPastStep = number < currentStep;

  const handleClick = () => {
    if (isPastStep) {
      dispatch(setCurrentStep(number));
    }
  };

  return (
    <div className={styles.container} onClick={handleClick}>
      <div className={styles.graphic}>
        <div
          className={
            isPastStep
              ? styles.successArm
              : active
              ? styles.activeArm
              : styles.arm
          }></div>
        <div
          className={
            isPastStep
              ? styles.successMain
              : active
              ? styles.activeMain
              : styles.main
          }>
          {isPastStep ? <AiOutlineCheck /> : <p>{number}</p>}
        </div>
        <div
          className={
            isPastStep
              ? styles.successArm
              : active
              ? styles.activeArm
              : styles.arm
          }></div>
      </div>
      <div
        className={
          isPastStep
            ? styles.successText
            : active
            ? styles.activeText
            : styles.text
        }>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default Step;
