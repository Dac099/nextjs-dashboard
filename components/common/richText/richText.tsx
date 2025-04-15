import './tiptap.css'
import styles from './styles.module.css';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import { FaBold } from "react-icons/fa";
import { FaItalic } from "react-icons/fa";
import { FaHeading } from "react-icons/fa";
import { PiListBulletsBold } from "react-icons/pi";
import { GoListOrdered } from "react-icons/go";
import { GoTasklist } from "react-icons/go";
import { ResponseChat } from '@/utils/types/items';
import { v4 as uuidV4 } from 'uuid';
import { getUserInfo } from '@/actions/auth';
import { useState } from 'react';
import { extractTasksFromHTML } from '@/utils/helpers';

type Props = {
  addNewChat: (chat: ResponseChat) => void;
}

export const RichText = ({ addNewChat }: Props) => {
  const [error, setError] = useState<{ status: boolean; message: string; }>({ status: false, message: '' });

  const editor = useEditor({
    autofocus: 'end',
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({
        nested: true,
      })
    ],
    content: 'Comparte tu opinión ... ',
  });

  const handleSubmitContent = async() => {
    const userId: string = await getUserInfo();
    const htmlContent = editor?.getHTML();

    if (userId.length === 0) {
      setError({ status: true, message: 'No se ha podido obtener la información del usuario' });
      return;
    }

    const newChat: ResponseChat = {
      id: uuidV4(),
      author: userId,
      message: htmlContent || '',
      responses: [],
      tasks: extractTasksFromHTML(htmlContent || ''),
      updated_at: new Date().toISOString().split('T')[0],
    };

    addNewChat(newChat);
    editor?.commands.clearContent();
  }

  return (
    <article className={styles['editor-container']}>
      <section className={styles['control-group']}>
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={editor?.isActive('bold') ? styles['is-active'] : ''}
        >
          <FaBold size={15} />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={editor?.isActive('italic') ? styles['is-active'] : ''}
        >
          <FaItalic size={15} />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor?.isActive('heading', { level: 1 }) ? styles['is-active'] : ''}
        >
          <FaHeading size={15} />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={editor?.isActive('bulletList') ? styles['is-active'] : ''}
        >
          <PiListBulletsBold size={18} />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={editor?.isActive('orderedList') ? styles['is-active'] : ''}
        >
          <GoListOrdered size={18} />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleTaskList().run()}
          className={editor?.isActive('taskList') ? styles['is-active'] : ''}
        >
          <GoTasklist size={18} />
        </button>
      </section>
      <EditorContent editor={editor} />

      <section className={styles['editor-area']}>
        <button
          type="button"
          className={styles['add-button']}
          onClick={handleSubmitContent}
        >
          Agregar
        </button>
      </section>

    </article>
  );
}
