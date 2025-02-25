'use client';
import { Chart } from 'react-google-charts';
import {GoogleChartData} from "@/actions/gantt";

type Props = {
  boardData: GoogleChartData;
};


export function GanttContainer({ boardData }: Props){
  const options = {
    gantt: {
      viewWindow: {
        min: new Date(2020, 0, 1),
        max: new Date(2030, 11, 31) 
      },
      viewMode: 'year', // Opciones: 'day', 'week', 'month', 'year'
      trackHeight: 30,
      labelStyle: {
        fontName: 'Arial',
        fontSize: 12,
        color: '#333'
      },
      barCornerRadius: 5,
      shadowEnabled: true
    }
  };
  return (
    <article
      style={{
        overflow: 'auto',
        height: '600px'
      }}
    >      
      <Chart
        chartType={'Gantt'}
        width={'100%'}
        height={'1500px'}
        data={boardData}
        options={options}
      />
    </article>
  );
}