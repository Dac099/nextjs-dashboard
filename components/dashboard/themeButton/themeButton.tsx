import useThemeStore from '@/stores/themeStore';
import { IoMdMoon } from "react-icons/io";
import { MdSunny } from "react-icons/md";
import styles from './styles.module.css';


export function ThemeButton() {
  const { theme, toggleTheme} = useThemeStore();

  return (
    <article 
      onClick={toggleTheme} 
      className={styles['theme--btn']}
    >
      {theme === 'light' ? <MdSunny /> : <IoMdMoon />}
    </article>
  );
}