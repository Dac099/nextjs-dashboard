"use client";
import styles from "./itemRow.module.css";
import type { Column, Item, TableValue } from "@/utils/types/groups";
import { ItemValue } from "@/components/common/itemValue/itemValue";
import { ProgressDial } from "../progressDial/progressDial";
import { ChatRing } from "../chatRing/chatRing";
import { getSubItems, addSubItem } from "@/actions/items";
import { RowTitle } from "@/components/common/rowTitle/rowTitle";
import { DeleteRowBtn } from "../deleteRowBtn/deleteRowBtn";
import { useEffect, useRef, useState, KeyboardEvent } from "react";
import { useRoleUserActions } from "@/stores/roleUserActions";
import useClickOutside from "@/hooks/useClickOutside";
import { subItemValueByColumnId } from '@/utils/helpers';
import { useItemStore } from "@/stores/useItemStore";

type Props = {
	item: Item;
	values: TableValue[] | undefined;
	columns: Column[];
};

export function ItemRow({ item, values, columns }: Props) {
	const setSubItemsValues = useItemStore(state => state.setSubItems);
	const subItems = useItemStore(state => state.subItemsMap);
	const addSubItemStore = useItemStore(state => state.addSubItem);
	const rowRef = useRef<HTMLDivElement>(null);
	const subItemInputRef = useRef<HTMLInputElement>(null);
	const userActions = useRoleUserActions((state) => state.userActions);
	const valuesByColumn = new Map<Column, TableValue>();
	const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
	const [showSubItems, setShowSubItems] = useState<boolean>(false);
	const [newSubItem, setNewSubItem] = useState<boolean>(false);

	useClickOutside(rowRef as React.RefObject<HTMLDivElement>, () => {
		setShowContextMenu(false);
	});

	useEffect(() => {
		if (newSubItem) {
			subItemInputRef.current?.focus();
		}
	}, [newSubItem]);

	useEffect(() => {
		async function fetchData() {
			const [subItemsResponse] = await Promise.all([
				getSubItems(item.id)
			]);
			setSubItemsValues(item.id, subItemsResponse);
		}

		fetchData();
	}, [item.id, setSubItemsValues]);

	columns.forEach((column) => {
		const value: TableValue =
			values?.find((value) => value.columnId === column.id) ||
			({} as TableValue);
		valuesByColumn.set(column, value);
	});

	const handleAddSubItem = async (itemName: string) => {
		const subItemId = await addSubItem(itemName, item.id);
		addSubItemStore(item.id, {
			id: subItemId,
			name: itemName,
			itemParent: item.id,
			values: []
		});
	}

	return (
		<section
			className={showSubItems ? styles.rowContainer : ''}
		>
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
						{/* <ChatRing chatData={chatData as ResponseChats} /> */}
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
							{userActions.includes('create') &&
								<div
									className={styles.menuOption}
									onClick={() => {
										setShowContextMenu(false);
										setShowSubItems(true);
										setNewSubItem(true);
									}}
								>
									Agregar Sub-Item
								</div>
							}
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
				{showSubItems &&
					<>
						<div
							className={styles.addSubItemBtn}
							onClick={() => setNewSubItem(!newSubItem)}
						>
							+
						</div>
						{newSubItem && userActions.includes("create") &&
							<section className={styles.groupRow}>
								<div>
									<input
										type="text"
										placeholder="Nombre del sub-item"
										className={styles.subItemInput}
										ref={subItemInputRef}
										onKeyDown={async (e: KeyboardEvent<HTMLInputElement>) => {
											if (e.key === 'Enter' || e.key === 'Enter') {
												e.preventDefault();
												const element = e.target as HTMLInputElement;
												const itemName = element.value.trim();
												console.log(itemName);

												if (itemName.length > 0) {
													setNewSubItem(false);
													await handleAddSubItem(itemName);
												}
											}
										}}
									/>
								</div>
								{columns.map((column) => (
									<div key={column.id}></div>
								))}
							</section>
						}
						{subItems.has(item.id) && subItems.get(item.id)!.length > 0 &&
							<section className={styles.subItemsList}>
								{
									subItems.get(item.id)!.map((subItem) => (
										<section key={subItem.id} className={`${styles.groupRow} ${styles.subItem}`}>
											<div className={styles.subItemTitle}>
												<RowTitle
													isSubItem={true}
													title={subItem.name}
													itemId={subItem.id}
												/>

												<section className={styles.itemOperations}>
													<div className={styles.deleteBtn}>
														<DeleteRowBtn
															itemId={subItem.id}
															isSubItem={true}
														/>
													</div>
												</section>
											</div>
											{columns.map((column) => (
												<div key={column.id}>
													<ItemValue
														value={subItemValueByColumnId(column.id, subItem) as TableValue}
														type={column.type}
														columnId={column.id}
														itemId={subItem.id}
													/>
												</div>
											))}
										</section>
									))
								}
							</section>
						}
					</>
				}
			</section>
		</section>
	);
}
