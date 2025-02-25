import { BoardData } from '@/utils/types/groups';
import { GanttComponent } from '@syncfusion/ej2-react-gantt';
import { formatBoardDataForGantt } from '@/utils/helpers';

type Props = {
  boardData: BoardData;
};

export function GanttContainer({ boardData }: Props){
  console.log(JSON.stringify(formatBoardDataForGantt(boardData)))
  return (
    <article>
      
    </article>
  );
}