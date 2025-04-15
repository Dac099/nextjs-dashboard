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
import { addItemChat } from '@/actions/projectDetail';
import { useSearchParams } from 'next/navigation';

type Props = {
  addNewChat: (chat: ResponseChat) => void;
}

export const RichText = ({ addNewChat }: Props) => {
  const searchParams = useSearchParams();
  const itemId = searchParams.get('itemId');
  const [error, setError] = useState<{ status: boolean; message: string; }>({ status: false, message: '' });
  const defaultTextValue = 'Comparte tu opinión...';

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
    content: defaultTextValue,
  });

  if (error.status) {
    alert(error.message);
  }

  const handleSubmitContent = async () => {
    const userData: { id: string; name: string } = { id: '', name: '' };

    if (editor?.getText() === defaultTextValue) {
      return;
    }

    try {
      const { id, name } = await getUserInfo();
      userData.id = id;
      userData.name = name;
    } catch (error) {
      if (error instanceof Error) {
        setError({ status: true, message: error.message });
        return;
      }
    }

    const htmlContent = editor?.getHTML();

    const newChat: ResponseChat = {
      id: uuidV4(),
      author: userData,
      message: htmlContent || '',
      responses: [],
      tasks: extractTasksFromHTML(htmlContent || ''),
      updated_at: new Date().toISOString().split('T')[0],
    };

    addNewChat(newChat);
    editor?.commands.setContent(defaultTextValue);
    await addItemChat(newChat, itemId as string);
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
