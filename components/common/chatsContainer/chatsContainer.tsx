import styles from './chatsContainer.module.css';
import { RichText } from '../richText/richText';
import { useEffect, useState } from 'react';
import type { ResponseChat } from '@/utils/types/items';
import { getUserInfo } from '@/actions/auth';
import Chat from '../chat/chat';

export function ChatsContainer() {
  const [chats, setChats] = useState<ResponseChat[]>([]);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      const dataResponse = await getUserInfo();
      setUserId(dataResponse);
    }

    fetchData();
  }, []);

  function addNewChat(chat: ResponseChat) {
    setChats((prev) => [...prev, chat]);
  }

  return (
    <article className={styles.mainContainer}>
      <section className={styles.inputText}>
        <RichText addNewChat={addNewChat} />
      </section>
      <section className={styles.tasks}>
        {chats.map((chat) => (
          <Chat 
            key={chat.id}
            chat={chat}
            userId={userId}
          />
        ))}
      </section>
    </article>
  );
}
