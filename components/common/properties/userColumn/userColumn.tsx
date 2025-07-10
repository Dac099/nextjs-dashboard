"use client";
import styles from "./userColumn.module.css";
import { ColumnData, ItemValue, ItemData, SubItemData } from "@/utils/types/views";
import { FaUserCircle as UserIcon } from "react-icons/fa";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import { getCurrentActiveUsers, defineUserValue} from "./actions";
import type { UserData } from "@/utils/types/items";

type Props = {
  column: ColumnData;
  itemData: ItemData | SubItemData;
  value: ItemValue | undefined;
  isSubItem?: boolean;
};

export function UserColumn({ column, itemData, value, isSubItem }: Props) {
  const defaultValue: UserData = value?.value
    ? JSON.parse(value.value)
    : { id: "", username: "", name: "Sin asignar", department: "" };
  const [showDisplayValue, setShowDisplayValue] = useState(true);
  const [userValue, setUserValue] = useState<UserData>(defaultValue);
  const [currentUsers, setCurrentUsers] = useState<UserData[]>([]);

  const handleGetUsers = async () => {
    if (currentUsers.length > 0) return;

    try {
      const users = await getCurrentActiveUsers();
      setCurrentUsers(users);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectUser = async(user: UserData) => {
    if(user.id === userValue.id) return;

    setUserValue(user);
    setShowDisplayValue(true);
    
    try {
      const newValue = {
        ...value,
        value: JSON.stringify(user)
      };
      await defineUserValue(itemData.id, column.id, newValue);
    } catch (error) {
      console.error(error);
    }
  };

  if(isSubItem) {
    return <article className={`${styles.mainContainer} ${styles.emptyValue}`}></article>
  }

  return (
    <article className={styles.mainContainer}>
      {showDisplayValue ? (
        <section
          className={styles.displayValue}
          onClick={() => setShowDisplayValue(false)}
          onMouseEnter={handleGetUsers}
        >
          <UserIcon className={styles.icon} size={15}/>
          <p className={styles.userName}>{userValue.name}</p>
        </section>
      ) : (
        <Dropdown
          className={styles.dropdown}
          options={currentUsers}
          optionLabel="name"
          value={userValue}
          onChange={(e) => handleSelectUser(e.value)}
          onKeyDown={e => {
            if(e.key === 'Enter' || e.key === 'Escape') {
              setShowDisplayValue(true);
            }
          }}
          placeholder='Asigna un usuario'
          onMouseLeave={() => setShowDisplayValue(true)}
          filter
        />
      )}
      <section className={styles.displayValue}></section>
    </article>
  );
}
