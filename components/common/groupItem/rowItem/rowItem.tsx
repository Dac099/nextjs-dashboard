import styles from './styles.module.css';
import { ItemData } from "@/utils/common/types";
import { MdOpenInFull } from "react-icons/md";
import { TaskRing } from "@/components/common/taskRing/taskRing";
import { ChatRing } from "@/components/common/chatRing/chatRing";
import { Status } from "@/components/common/properties/status/status"
import { Primitive } from "@/components/common/properties/primitive/primitive";
import { DefinedDate } from "@/components/common/properties/definedDate/definedDate";
import { TimeLine } from "@/components/common/properties/timeLine/timeLine";
import {Person} from "@/components/common/properties/person/person";

type Props = {
    item: ItemData;
};

export const RowItem = ({item}: Props) => {
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
                    <span className={styles['open-tag']}>
                        Detalle
                        <MdOpenInFull className={styles['icon-open']} />
                    </span>
                </section>

                <section className={styles.complements}>
                    <TaskRing completedTasks={item.completedTasks} totalTasks={item.totalTasks} />
                    <ChatRing chats={item.chats} itemId={item.id} />
                </section>
            </div>

            {
                item.properties.map((property) => (
                    <div key={property.id}>
                        {property.type === 'Status' && <Status property={property} />}
                        {(property.type === 'Number' || property.type === 'Text') && <Primitive property={property} />}
                        {property.type === 'Date' && <DefinedDate property={property} />}
                        {property.type === 'TimeLine' && <TimeLine property={property} />}
                        {property.type === 'User' && <Person property={property} />}
                    </div>
                ))
            }
        </article>
    );
}