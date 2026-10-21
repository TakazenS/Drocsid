import styles from './ServerIcon.module.css';

interface Props {
  serverIconUrl?: string;
  serverName: string;
}

export default function ServerIcon(props: Props) {
  const { serverIconUrl, serverName } = props;

  return (
    <span className={styles.iconLayout} onClick={() => console.log(`${serverName}`)}>
      {serverIconUrl && <img src={serverIconUrl} />}
    </span>
  );
}
