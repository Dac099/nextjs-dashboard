import styles from './styles.module.css';
import type { ItemData, ItemDetail } from "@/utils/common/types";
import { TaskRing } from "@/components/common/taskRing/taskRing";
import { ChatRing } from "@/components/common/chatRing/chatRing";
import { Status } from "@/components/common/properties/status/status"
import { Primitive } from "@/components/common/properties/primitive/primitive";
// import { DefinedDate } from "@/components/common/properties/definedDate/definedDate";
import { TimeLine } from "@/components/common/properties/timeLine/timeLine";
// import { Person } from "@/components/common/properties/person/person";
import { getTasksData } from '@/actions/groups';
import { DetailBtn } from '../detailBtn/detailBtn';

type Props = {
    detail: ItemDetail;
    item: ItemData
};

export async function RowItem({ detail, item }: Props){
    const tasksInfo = await getTasksData(item.id);
    return (
        <article className={styles.row}>
            <div className={styles.checkbox}>
                <input type="checkbox"/>
            </div>

            <div className={styles['title-container']}>
                <section
                    className={styles.title}
                >
                    <p>{item.title}</p>     
                    <DetailBtn 
                        itemId={item.id}
                        containerClass={styles['open-tag']}
                        iconClassName={styles['icon-open']}
                    />               
                </section>

                <section className={styles.complements}>
                    <div>
                        {!(tasksInfo instanceof Error) && tasksInfo.totalTasks > 0 &&
                            <TaskRing completedTasks={tasksInfo.completedTasks} totalTasks={tasksInfo.totalTasks} />
                        }
                    </div>
                    <div>
                        <ChatRing chats={detail.chats} itemId={item.id} />
                    </div>
                </section>
            </div>
            {
                detail.textProps.map(property => (<Primitive property={property} key={property.id}/>))
            }
            {
                detail.numberProps.map(property => (<Primitive property={property} key={property.id}/>))
            }
            {
                detail.statusProps.map(property => (<Status property={property} key={property.id}/>))
            }
            {
                detail.timelineProps.map(property => (<TimeLine property={property} key={property.id}/>))
            }
        </article>
    );
}