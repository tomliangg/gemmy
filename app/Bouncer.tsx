import styles from "./Bouncer.module.scss";

export default function Bouncer() {
  return (
    <div className={styles.bouncerContainer}>
      <div className={styles.bouncer}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
