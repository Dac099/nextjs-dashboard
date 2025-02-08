'use client';

import styles from './styles.module.css';
import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import {Tooltip} from "@/components/common/tooltip/tooltip";
import { FaCheck } from "react-icons/fa";

type Props = {
    totalTasks: number;
    completedTasks: number;
};

export const TaskRing = ({ totalTasks, completedTasks }: Props) => {
    const percentage = (100 * completedTasks) / totalTasks || 0;
    const data = [{value: percentage}];

    return (
        <Tooltip text={`${completedTasks}/${totalTasks} marcadas`}>
            <article className={styles.container}>
                <span className={styles.icon}>
                    <FaCheck size={10} />
                </span>

                <RadialBarChart
                    width={30}
                    height={30}
                    cx="50%"
                    cy="50%"
                    innerRadius="80%"
                    outerRadius="100%"
                    barSize={10}
                    data={data}
                >
                 <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    angleAxisId={0}
                    tick={false}
                 />

                <RadialBar
                    background
                    dataKey="value"
                    fill="#68E287FF"
                />
                </RadialBarChart>
            </article>
        </Tooltip>
    );
};