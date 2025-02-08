import styles from './styles.module.css';
import { BsFiles } from "react-icons/bs";
import { LuLogs } from "react-icons/lu";
import { TbListDetails } from "react-icons/tb";
import { BsChatLeftTextFill } from "react-icons/bs";
import { DetailView } from '@/utils/common/types';

type Props = {
  setViewSelected: (view: DetailView) => void;
  viewSelected: DetailView;
};

export const DetailBar = ({ setViewSelected, viewSelected }: Props) => {
  return (
    <div className={styles.container}>
      <section 
        className={styles['container--item']}
        onClick={() => setViewSelected('chats')}
      >
        <BsChatLeftTextFill className={styles.icon} size={18} />
        <p className={styles.text}>Chats</p>
        {viewSelected === 'chats' && <span className={styles['indicator']}></span>}
      </section>

      <section 
        className={styles['container--item']}
        onClick={() => setViewSelected('files')}
      >
        <BsFiles className={styles.icon} size={18} />
        <p className={styles.text}>Archivos</p>
        {viewSelected === 'files' && <span className={styles['indicator']}></span>}
        </section>

      <section 
        className={styles['container--item']}
        onClick={() => setViewSelected('activity')}
      >
        <LuLogs className={styles.icon} size={18} />
        <p className={styles.text}>Actividad</p>
        {viewSelected === 'activity' && <span className={styles['indicator']}></span>}
        </section>

      <section 
        className={styles['container--item']}
        onClick={() => setViewSelected('projectDetail')}
      >
        <TbListDetails className={styles.icon} size={18} />
        <p className={styles.text}>Detalle de proyecto</p>
        {viewSelected === 'projectDetail' && <span className={styles['indicator']}></span>}
        </section>
    </div>
  );
}