'use client';

import styles from './chat.module.css';
import { ResponseChat } from '@/utils/types/items';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useState } from 'react';

type Props = {
  chat: ResponseChat;
  userId: string;
}

export default function Chat({chat, userId}: Props){  
  const [editContainer, setEditContainer] = useState<boolean>(false);

  const handleSetEditContainer = () => {
    setEditContainer(!editContainer);
    //Hacer editable el contenido
    //Hacer aparecer el boton de guardar
  };

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({
        nested: true,
      })
    ],
    content: chat.message,
    editable: false
  });

  return (
    <section className={styles.mainContent}>
      <EditorContent editor={editor}/>
      <section className={styles.controls}>
        {chat.author === userId &&
          <button 
            className={styles.controlBtn}
            onClick={() => editor?.setEditable(true)}
          >
            Editar
          </button>
        }
        <button className={styles.controlBtn}>Comentar</button>
      </section>
    </section>
  );
}