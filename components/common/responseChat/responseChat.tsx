'use client';

import { ChatData } from '@/utils/common/types';
import styles from './responseChat.module.css';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { FaUserLarge } from "react-icons/fa6";
import { useState } from 'react';
import { RiChatUploadFill } from "react-icons/ri";

type Props = {
  chat: ChatData;
};

export const ResponseChat = ({ chat }: Props) => {
  const [ showSubtmitBtn, setShowSubmitBtn ] = useState<boolean>(false);

  const editor = useEditor({
      autofocus: false,
      extensions: [
        StarterKit,
        Document,
        Paragraph,
        Text,
        TaskList,
        TaskItem.configure({
          nested: true,
        })
      ],
      content: chat.message,
    });
  return (
    <article className={styles.container}>
      <section className={styles['container-header']}>
        <FaUserLarge size={25}/>
        <p>{'Nombre de usuario'}</p>
      </section>
      <section>
        <EditorContent editor={editor} />
      </section>
      <section className={styles['chat-responses']}>
        {/* Hay obtener las respuestas de los chats para iterar sobre ellas */}
        <article className={styles['chat-response-container']}>
          <FaUserLarge size={18}/>
          <div className={styles['chat-response']}>
            <span>Nombre de usuario</span>
            <p>Tenemos que revisar esos pendientes</p>
          </div>
        </article>
      </section>
      <section className={styles['chat-input']}>
        <textarea 
          placeholder='¿Qué opinas?' 
          className={styles['response-entrance']}
          rows={3}
          onChange={(e) => {
            if(e.target.value.length > 0) {
              setShowSubmitBtn(true);
            }else{
              setShowSubmitBtn(false);
            }
          }}
        ></textarea>
        {showSubtmitBtn &&
          <button
            type='button'
          >
            Enviar
            <RiChatUploadFill size={18}/>
          </button>
        }
      </section>
    </article>
  );
}
