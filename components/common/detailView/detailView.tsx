import styles from './detailView.module.css';
import { useEffect, useState } from 'react';
import {
  getProjectDataByItem,
  getItemDetail
} from '@/actions/items';
import { Item, ProjectData, ResponseChat } from '@/utils/types/items';
import { formatDate } from '@/utils/helpers';
import { PiChatsFill } from 'react-icons/pi';
import { LuLogs } from 'react-icons/lu';
import { ChatsContainer } from '@/components/common/chatsContainer/chatsContainer';
import { ProjectContainer } from '../projectContainer/projectContainer';
import { LogsContainer } from '../logsContainer/logsContainer';
import { Skeleton } from '../skeleton/skeleton';
import { FaMoneyBillWave } from "react-icons/fa";
import { BillingContainer } from "@/components/common/billingContainer/billingContainer";
import { getItemChats } from '@/actions/projectDetail';
import { FaToolbox } from "react-icons/fa6";

type Props = {
  itemId: string;
  closeContainer: () => void;
}

export function DetailView({ itemId, closeContainer }: Props) {
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [itemDetail, setItemDetail] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [onError, setOnError] = useState<boolean>(false);
  const [viewSelected, setViewSelected] = useState<string>('chats');
  const [isProject, setIsProject] = useState<boolean>(false);
  const [itemChats, setItemChats] = useState<ResponseChat[]>([]);

  useEffect(() => {
    async function fetchData(itemId: string): Promise<[ProjectData, Item[], ResponseChat[]]> {
      return await Promise.all([
        getProjectDataByItem(itemId),
        getItemDetail(itemId),
        getItemChats(itemId)
      ]);
    }

    if (itemId) {
      fetchData(itemId)
        .then(([project, item, itemChats]) => {
          setProjectData(project);
          setItemDetail(item);
          setIsProject(!Object.values(project).every(item => item === null));
          setItemChats(itemChats);
        })
        .finally(() => setIsLoading(false))
        .catch(() => setOnError(true));
    }
  }, [itemId]);

  if (onError) {
    alert('Ha ocurrido un error');
  }

  if (isLoading) {
    return (
      <>
        <section className={styles.loaderHeader}>
          <Skeleton width='100%' height='100%' rounded='5px' />
          <Skeleton width='100%' height='100%' rounded='5px' />
        </section>
        <section className={styles.loaderViews}>
          <Skeleton width='120px' height='35px' rounded='5px' />
          <Skeleton width='120px' height='35px' rounded='5px' />
          <Skeleton width='120px' height='35px' rounded='5px' />
        </section>
        <section className={styles.loaderContent}>
          <Skeleton width='700px' height='200px' rounded='5px' />
          <Skeleton width='700px' height='200px' rounded='5px' />
          <Skeleton width='700px' height='200px' rounded='5px' />
        </section>
      </>
    );
  }

  return (
    <>
      <section className={styles.loaderHeader}>
        <section className={styles.loaderHeaderTitle}>
          <span className={styles.closeBtn} onClick={closeContainer}>x</span>
          <p>{itemDetail[0].name}</p>
        </section>
        <p>{formatDate(itemDetail[0].created_at)}</p>
      </section>

      <section className={styles.loaderViews}>
        <article
          className={`${styles.viewBtn} ${viewSelected == 'chats' ? styles.viewBtnSelected : ''}`}
          onClick={() => setViewSelected('chats')}
        >
          <PiChatsFill size={20} />
          Chats
        </article>

        {isProject &&
          <article
            className={`${styles.viewBtn} ${viewSelected == 'projectDetail' ? styles.viewBtnSelected : ''}`}
            onClick={() => setViewSelected('projectDetail')}
          >
            <FaToolbox />
            Detalle del proyecto
          </article>
        }

        <article
          className={`${styles.viewBtn} ${viewSelected == 'logs' ? styles.viewBtnSelected : ''}`}
          onClick={() => setViewSelected('logs')}
        >
          <LuLogs size={20} />
          Logs
        </article>

        {isProject &&
          <article
            className={`${styles.viewBtn} ${viewSelected == 'billing' ? styles.viewBtnSelected : ''}`}
            onClick={() => setViewSelected('billing')}
          >
            <FaMoneyBillWave />
            Cobranza
          </article>
        }
      </section>
      <hr className={styles.division} />


      <section className={styles.loaderContent}>
        {viewSelected === 'chats' && <ChatsContainer itemChats={itemChats} setItemChats={setItemChats} />}
        {viewSelected === 'projectDetail' && <ProjectContainer data={projectData as ProjectData} />}
        {viewSelected === 'logs' && <LogsContainer />}
        {viewSelected === 'billing' && <BillingContainer idProject={projectData!.id} projectName={projectData!.name} />}
      </section>
    </>
  );
}
