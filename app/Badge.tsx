import { cx } from "@emotion/css";
import styles from "./Badge.module.scss";

interface BadgeProps {
  name: "ME" | "AI";
}

const Badge = ({ name }: BadgeProps) => {
  return <div className={cx(styles.badge, styles[name])}>{name}</div>;
};

export default Badge;
