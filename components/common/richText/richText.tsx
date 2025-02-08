import './tiptap.css'
import styles from './styles.module.css';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { FaBold } from "react-icons/fa";
import { FaItalic } from "react-icons/fa";
import { FaHeading } from "react-icons/fa";
import { PiListBulletsBold } from "react-icons/pi";
import { GoListOrdered } from "react-icons/go";
import { GoTasklist } from "react-icons/go";

export const RichText = () => {

  const editor = useEditor({
    autofocus: true,
    immediatelyRender: false,
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
    content: '¿Cuál es el tema a tratar?',
  });

  const handleSubmitContent = () => {
    console.log(editor?.getHTML());
  }

  return (
    <article className={styles['editor-container']}>
      <section className={styles['control-group']}>
        <button 
          onClick={() => editor?.chain().focus().toggleBold().run()} 
          className={editor?.isActive('bold') ? 'is-active' : ''}
        >
          <FaBold size={15}/>
        </button>
        <button 
          onClick={() => editor?.chain().focus().toggleItalic().run()} 
          className={editor?.isActive('italic') ? 'is-active' : ''}
        >
          <FaItalic size={15}/>
        </button>
        <button 
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} 
          className={editor?.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        >
          <FaHeading size={15}/>
        </button>
        <button 
          onClick={() => editor?.chain().focus().toggleBulletList().run()} 
          className={editor?.isActive('bulletList') ? 'is-active' : ''}
        >
          <PiListBulletsBold size={18}/>
        </button>
        <button 
          onClick={() => editor?.chain().focus().toggleOrderedList().run()} 
          className={editor?.isActive('orderedList') ? 'is-active' : ''}
        >
          <GoListOrdered size={18}/>
        </button>
        <button 
          onClick={() => editor?.chain().focus().toggleTaskList().run()} 
          className={editor?.isActive('taskList') ? 'is-active' : ''}
        >
          <GoTasklist size={18}/>
        </button>
      </section>
      <EditorContent editor={editor}/>

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
