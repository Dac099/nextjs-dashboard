import styles from './progressDial.module.css';
import { MdDone } from "react-icons/md";

type Props = {
  total: number;
  completed: number
}

export function ProgressDial({ total, completed }: Props){
  // Calcular el porcentaje completado
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  // Dimensiones ajustadas para un componente más pequeño
  const size = 30; // Tamaño total del componente
  const radius = size / 3; // Radio proporcional al tamaño
  const strokeWidth = size / 15; // Grosor del trazo proporcional
  const centerX = size / 2;
  const centerY = size / 2;
  
  // El ángulo de inicio es -90 grados (arriba) y calculamos cuánto del círculo debe estar lleno
  const startAngle = -90;
  const endAngle = startAngle + (percentage / 100) * 360;
  
  // Convertir a radianes
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  
  // Calcular puntos de inicio y fin del arco
  const startX = centerX + radius * Math.cos(startRad);
  const startY = centerY + radius * Math.sin(startRad);
  const endX = centerX + radius * Math.cos(endRad);
  const endY = centerY + radius * Math.sin(endRad);
  
  // Determinar si es un arco mayor o menor
  const largeArcFlag = percentage > 50 ? 1 : 0;
  
  // Crear el path para el arco
  const arcPath = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
  
  // Color según el progreso
  const getColor = () => {
    if (percentage < 33) return '#ef4444'; // Rojo
    if (percentage < 66) return '#f59e0b'; // Amarillo
    return '#22c55e'; // Verde
  };

  return (
    <div className={styles["progress-dial-container"]} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Círculo de fondo */}
        <circle 
          cx={centerX} 
          cy={centerY} 
          r={radius} 
          fill="none"
          stroke="#e5e7eb" 
          strokeWidth={strokeWidth} 
        />
        
        {/* Arco de progreso */}
        {percentage > 0 && (
          <path 
            d={arcPath} 
            fill="none"
            stroke={getColor()} 
            strokeWidth={strokeWidth} 
            strokeLinecap="round" 
          />
        )}
      </svg>
      
      {/* Icono central */}
      <div className={styles["progress-dial-icon-container"]}>
        <MdDone 
          size={size/3} 
          color={getColor()} 
        />
      </div>
    </div>
  );
}