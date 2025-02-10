import styles from './styles.module.css';
import {Tooltip} from "@/components/common/tooltip/tooltip";

type Props = {
    totalTasks: number;
    completedTasks: number;
};

export const TaskRing = ({ totalTasks, completedTasks }: Props) => {
    const percentage = (100 * completedTasks) / totalTasks || 0;
    const radius: number = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <Tooltip text={`${completedTasks}/${totalTasks} tareas completadas`}>
            <svg width={30} height={30} viewBox="0 0 120 120">
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="transparent"
                    strokeWidth="10"
                    className={styles['circle-back']}
                />
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="transparent"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                    className={styles['circle-front']}
                />
                <text
                    x="60"
                    y="65"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={styles['graph-text']}
                >
                    {completedTasks}/{totalTasks}
                </text>
            </svg>
        </Tooltip>
    );
};