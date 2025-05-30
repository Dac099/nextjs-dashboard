import {HeaderBoard} from "@/components/dashboard/headerBoard/headerBoard";
import {getBoardViews} from "@/actions/boards";
import {ViewWithSettings} from "@/utils/types/views";
import {ReactNode} from "react";
import {ItemDetail} from "@/components/dashboard/itemDetail/itemDetail";
import { roleAccess } from "@/utils/userAccess";

type Props = {
  params: Promise<{ id: string }>
  children: ReactNode;
};

export default async function Layout({ params, children }: Props) {
  const boardId: string = (await params).id;
  const views: ViewWithSettings[] = await getBoardViews(boardId);
  const actions = await roleAccess(boardId);

  return(
    <article style={{position: "relative"}}>
      <ItemDetail />
      <HeaderBoard views={views} boardId={boardId} userActions={actions}/>
        {children}
    </article>
  );
}