import MainView from './layout/MainView';
import ServerList from './layout/ServerList';

import styles from './App.module.css';

function App() {
  return (
    <main className={styles.app}>
      <ServerList />
      <MainView />
    </main>
  );
}

export default App;
