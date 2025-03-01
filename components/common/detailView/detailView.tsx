import styles from './detailView.module.css';
import { useEffect, useState } from 'react';
import { 
  getItemChats, 
  getProjectData, 
  getItemDetail 
} from '@/actions/items';
import { Item, ProjectData, ResponseChats } from '@/utils/types/items';
import { formatDate } from '@/utils/helpers';
import { PiChatsFill } from 'react-icons/pi';
import { SiGoogleforms } from 'react-icons/si';
import { LuLogs } from 'react-icons/lu';
import { ChatsContainer } from '../chatsContainer/chatsContainer';
import { ProjectContainer } from '../projectContainer/projectContainer';
import { LogsContainer } from '../logsContainer/logsContainer';
import { Skeleton } from '../skeleton/skeleton';

type Props = {
  itemId: string;
}

export function DetailView({itemId}: Props)
{
  const [chatData, setChatData] = useState<ResponseChats>({} as ResponseChats);
  const [projectData, setProjectData] = useState<ProjectData[]>([]);
  const [itemDetail, setItemDetail] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [onError, setOnError] = useState<boolean>(false);
  const [viewSelected, setViewSelected] = useState<string>('chats');

  useEffect(() => {
    async function fetchData(itemId: string): Promise<[ResponseChats, ProjectData[], Item[]]>{
        return await Promise.all([
            getItemChats(itemId), 
            getProjectData(itemId), 
            getItemDetail(itemId)
        ]);            
    }

    if(itemId){
        fetchData(itemId)
        .then(([chats, project, item]) => {
            setChatData(chats);
            setProjectData(project);
            setItemDetail(item);
        })
        .finally(() => setIsLoading(false))
        .catch(() => setOnError(true));            
    }
  }, [itemId]);

  if(isLoading)
  {
    return (
      <>
        <section className={styles.loaderHeader}>
          <Skeleton width='100%' height='100%' rounded='5px'/>
          <Skeleton width='100%' height='100%' rounded='5px'/>
        </section>
        <section className={styles.loaderViews}>
          <Skeleton width='120px' height='35px' rounded='5px'/>
          <Skeleton width='120px' height='35px' rounded='5px'/>
          <Skeleton width='120px' height='35px' rounded='5px'/>
        </section>
        <section className={styles.loaderContent}>
          <Skeleton width='700px' height='200px' rounded='5px'/>
          <Skeleton width='700px' height='200px' rounded='5px'/>
          <Skeleton width='700px' height='200px' rounded='5px'/>
        </section>
      </>
    );
  }

  return (
    <>
      <section className={styles.loaderHeader}>
          <p>{itemDetail[0].name}</p>
          <p>{formatDate(itemDetail[0].created_at)}</p>
      </section>

      <section className={styles.loaderViews}>
          <article 
              className={`${styles.viewBtn} ${viewSelected == 'chats' ? styles.viewBtnSelected : ''}`}
              onClick={() => setViewSelected('chats')}
          >
              <PiChatsFill size={20}/>
              Chats
          </article>

          <article 
              className={`${styles.viewBtn} ${viewSelected == 'projectDetail' ? styles.viewBtnSelected : ''}`}
              onClick={() => setViewSelected('projectDetail')}
          >
              <SiGoogleforms size={20}/>
              Detalle del proyecto
          </article>

          <article 
              className={`${styles.viewBtn} ${viewSelected == 'logs' ? styles.viewBtnSelected : ''}`}
              onClick={() => setViewSelected('logs')}
          >
              <LuLogs size={20}/>
              Logs
          </article>
      </section>
      <hr className={styles.division}/>


      <section className={styles.loaderContent}>
          {viewSelected === 'chats' && <ChatsContainer />}
          {viewSelected === 'projectDetail' && <ProjectContainer data={projectData[0]}/>}
          {viewSelected === 'logs' && <LogsContainer />}
      </section>
    </>
  );
}