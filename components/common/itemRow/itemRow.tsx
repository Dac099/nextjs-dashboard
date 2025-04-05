"use client";
import styles from "./itemRow.module.css";
import { Column, Item, TableValue } from "@/utils/types/groups";
import { ItemValue } from "@/components/common/itemValue/itemValue";
import { ProgressDial } from "../progressDial/progressDial";
import { ChatRing } from "../chatRing/chatRing";
import { ResponseChats } from "@/utils/types/items";
import { getItemChats } from "@/actions/items";
import { RowTitle } from "@/components/common/rowTitle/rowTitle";
import { DeleteRowBtn } from "../deleteRowBtn/deleteRowBtn";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useRoleUserActions } from "@/stores/roleUserActions";
import useClickOutside from "@/hooks/useClickOutside";

type Props = {
  item: Item;
  values: TableValue[] | undefined;
  columns: Column[];
};

export function ItemRow({ item, values, columns }: Props) {
  const { id: boardId } = useParams();
  const rowRef = useRef<HTMLDivElement>(null);
  const userActions = useRoleUserActions((state) => state.userActions);
  const [chatData, setChatData] = useState<ResponseChats | null>(null);
  const valuesByColumn = new Map<Column, TableValue>();
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
	const [showSubItems, setShowSubItems] = useState<boolean>(false);
	const subItems = new Array(5).fill('subItem');

  useClickOutside(rowRef as React.RefObject<HTMLDivElement>, () => {
    setShowContextMenu(false);
  });

  useEffect(() => {
    async function fetchData() {
      const chatsResponse = await getItemChats(item.id);
      setChatData(chatsResponse);
    }

    fetchData();
  }, [boardId, item.id]);

  columns.forEach((column) => {
    const value: TableValue =
      values?.find((value) => value.columnId === column.id) ||
      ({} as TableValue);
    valuesByColumn.set(column, value);
  });

  return (
		<section>
			<section className={styles.groupRow}>
				<div
					className={styles.itemTitle}
					onContextMenu={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setShowContextMenu(true);
					}}
				>
					<RowTitle itemId={item.id} title={item.name} />

					<article className={styles.deleteRow}>
						{userActions.includes("update") && <DeleteRowBtn itemId={item.id} />}
					</article>

					<article className={styles.tasksContainer}>
						<ProgressDial completed={0} total={10} />
					</article>

					<article className={styles.chatContainer}>
						<ChatRing chatData={chatData as ResponseChats} />
					</article>

					{showContextMenu && 
						<article className={styles.contextMenu} ref={rowRef}>
							<div 
								className={styles.menuOption}
								onClick={() => {
									setShowContextMenu(false);
									setShowSubItems(!showSubItems);
								}}
							>
								{showSubItems ? 'Ocultar' : 'Mostrar'} Sub-Items
							</div>
						</article>
					}
				</div>
				{columns.map((column) => (
					<div key={column.id}>
						<ItemValue
							value={valuesByColumn.get(column) as TableValue}
							type={column.type}
							columnId={column.id}
							itemId={item.id}
						/>
					</div>
				))}
			</section>

			<section className={styles.subItemsContainer}>
				{showSubItems && subItems.length > 0 &&
					subItems.map((subItem, index) => (
						<section key={index} className={`${styles.groupRow} ${styles.subItem}`}>
							<div>{subItem}</div>
							{columns.map((column) => (
								<div key={column.id}>
									<ItemValue
										value={valuesByColumn.get(column) as TableValue}
										type={column.type}
										columnId={column.id}
										itemId={item.id}
									/>
								</div>
							))}
						</section>
					))
				}
			</section>
		</section>
  );
}
