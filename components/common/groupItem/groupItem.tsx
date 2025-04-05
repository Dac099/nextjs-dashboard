"use client";

import styles from "./groupItem.module.css";
import type { Group, Column, Item, ItemValues } from "@/utils/types/groups";
import { GroupTitle } from "../groupTitle/groupTitle";
import { GroupHeaderColumn } from "../groupHeaderColumn/groupHeaderColumn";
import { AddItemSection } from "@/components/common/addItemSection/addItemSection";
import { ItemRow } from "@/components/common/itemRow/itemRow";
import { LuChevronDown as Arrow } from "react-icons/lu";
import { useState } from 'react';
import { CollapsedGroup } from '../collapsedGroup/collapsedGroup';
import { useRoleUserActions } from "@/stores/roleUserActions";

type Props = {
  group: Group;
  columns: Column[];
  items: Item[];
  values: ItemValues;
};

export function GroupItem({ group, columns, items, values }: Props) {
	const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
	const userActions = useRoleUserActions((state) => state.userActions);

	if(isCollapsed){
		return <CollapsedGroup 
			group={group} 
			columns={columns} 
			items={items} 
			values={values}
			setIsCollapsed={setIsCollapsed}
			isCollapsed={isCollapsed}
		/>
	}
	return (
		<article className={styles.groupItem}>
			<section className={styles.headerItemSection}>
				<Arrow 
					size={20}
					className={isCollapsed ? styles.downBtn : ''}
					onClick={() => setIsCollapsed(!isCollapsed)}
					style={{
						cursor: 'pointer',
						color: group.color
					}}
				/>
				<GroupTitle group={group} />			
			</section>
			
			<section
				className={styles.groupBody}
				style={{ borderLeftColor: group.color }}
			>
				<section className={`${styles.groupRow} ${styles.groupHeader}`}>

					<div className={styles.groupHeaderProyect}>
						<p>Proyecto</p>
					</div>

					{columns.map((column) => (
						<GroupHeaderColumn key={column.id} column={column} />
					))}
					
				</section>

				{userActions.includes('create') && 
					<AddItemSection columns={columns} groupId={group.id} />
				}

				{items &&
					items.length > 0 &&
					items.map((item) => (
						<ItemRow
							item={item}
							values={values.get(item.id)}
							columns={columns}
							key={item.id}
						/>
					))
				}
			</section>			
		</article>
	);
}
