import {HeaderBoard} from "@/components/dashboard/headerBoard/headerBoard";
import {getBoardViews} from "@/actions/boards";
import {ViewWithSettings} from "@/utils/types/views";
import {ReactNode} from "react";

type Props = {
  params: Promise<{ id: string }>
  children: ReactNode;
};

export default async function Layout({ params, children }: Props) {
  const boardId: string = (await params).id;
  const views: ViewWithSettings[] = await getBoardViews(boardId);

  return(
    <article>
      <HeaderBoard views={views} boardId={boardId} />
      {children}
    </article>
  );
}