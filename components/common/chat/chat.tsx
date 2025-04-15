'use client';

import styles from './chat.module.css';
import { ResponseChat, Response as ResponseItem } from '@/utils/types/items';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useState } from 'react';
import { BiSolidUserCircle as UserIcon } from "react-icons/bi";
import { extractTasksFromHTML, getDateSQLFormat } from '@/utils/helpers';
import { getUserInfo } from '@/actions/auth';
import { v4 as uuidv4 } from 'uuid';
import { RiMailSendFill as SendMsgIcon } from "react-icons/ri";
import { updateChat, addChatResponse } from '@/actions/projectDetail';

type Props = {
  chat: ResponseChat;
  userData: { id: string; name: string };
}

export default function Chat({ chat, userData }: Props) {
  const [editContainer, setEditContainer] = useState<boolean>(false);
  const [responses, setResponses] = useState<ResponseItem[]>(chat.responses);
  const [showInputResponse, setShowInputResponse] = useState<boolean>(false);
  const [responseMsg, setResponseMsg] = useState<string>('');

  const handleSetEditContainer = () => {
    setEditContainer(true);
    editor?.setEditable(true);
  };

  const handleCancelEdit = () => {
    setEditContainer(false);
    editor?.setEditable(false);
  };

  const handleUpdateNewChat = async () => {
    if (editor?.getHTML() === chat.message) {
      setEditContainer(false);
      editor?.setEditable(false);
      return;
    }

    const newMsg = editor?.getHTML();
    const updatedChat: ResponseChat = {
      ...chat,
      message: newMsg || '',
      tasks: extractTasksFromHTML(newMsg || '')
    };
    updateChat(updatedChat);
    setEditContainer(false);
    editor?.setEditable(false);
  };

  const handleAddResponse = async (message: string) => {
    const userData: { id: string; name: string } = { id: '', name: '' };

    try {
      const { id, name } = await getUserInfo();
      userData.id = id;
      userData.name = name;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        return;
      }
    }
    const date = getDateSQLFormat();
    const response: ResponseItem = {
      id: uuidv4(),
      author: userData,
      message: message,
      updated_at: date
    };

    const responsesUpdated = [...responses, response];
    setResponses(responsesUpdated);
    setResponseMsg('');
    setShowInputResponse(false);
    addChatResponse(chat.id, responsesUpdated);
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
      <section className={styles.headerChat}>
        <UserIcon className={styles.userIcon} />
        <p>{chat.author.name}</p>
      </section>

      <EditorContent editor={editor} />

      <section className={styles.controls}>
        <button
          className={styles.controlBtn}
          onClick={() => setShowInputResponse(prev => !prev)}
        >
          Comentar
        </button>
        {chat.author.id === userData.id && !editContainer &&
          <button
            className={`${styles.controlBtn} ${styles.editBtn}`}
            onClick={handleSetEditContainer}
          >
            Editar
          </button>
        }
        {editContainer &&
          <button
            className={styles.controlBtn}
            onClick={handleUpdateNewChat}
          >
            Guardar
          </button>
        }
        {editContainer &&
          <button
            className={`${styles.controlBtn} ${styles.editBtn}`}
            onClick={handleCancelEdit}
          >
            Cancelar
          </button>
        }
      </section>

      {showInputResponse &&
        <section className={styles.inputResponse}>
          <textarea
            placeholder='Rompe el hielo ...'
            className={styles.inputResponseField}
            onChange={(e) => setResponseMsg(e.target.value)}
            value={responseMsg}
          />
          <button
            className={`${styles.sendMsgBtn} ${responseMsg.length === 0 ? styles.sendMsgBtnDisabled : ''}`}
            onClick={() => handleAddResponse(responseMsg)}
          >
            <SendMsgIcon className={styles.sendMsgIcon} />
          </button>
        </section>
      }

      <section className={styles.chatResponses}>
        {responses.length === 0 &&
          <p className={styles.emptyResponsesTitle}>Sin comentarios</p>
        }
        {responses.map(response => (
          <article className={styles.response} key={response.id}>
            <UserIcon className={styles.userIcon} style={{ color: 'var(--accent-color)' }} />
            <div>
              <p>{response.author.name}</p>
              <p className={styles.responseMsg}>
                {response.message}
              </p>
            </div>
          </article>
        ))}
      </section>
    </section>
  );
}
