"use client";

import styles from "./styles.module.css";
import { Calendar } from "primereact/calendar";
import { useEffect, useState, useRef } from "react";
import { TableValue } from "@/utils/types/groups";
import { useParams } from "next/navigation";
import { setTableValue } from "@/actions/groups";
import { ProgressBar } from "primereact/progressbar";
import { useRoleUserActions } from "@/stores/roleUserActions";
import { Nullable } from "primereact/ts-helpers";
import { calculatePercentageBetweenDates } from "@/utils/helpers";
import { formatTimeLineItemValue } from "@/utils/helpers";

type Props = {
  value: TableValue;
  columnId: string;
  itemId: string;
};

/**
 * Componente `TimeLine`
 *
 * Renderiza un calendario de selección de rango de fechas y una barra de progreso que indica el porcentaje de avance entre dos fechas seleccionadas.
 * Permite seleccionar un rango de fechas y muestra el rango seleccionado en formato legible. El progreso se calcula en base a las fechas seleccionadas.
 *
 * @param props - Propiedades del componente.
 * @param props.value - Objeto de tipo TableValue que contiene un campo `value`, el cual es un JSON que representa un arreglo de dos fechas (`[fechaInicial, fechaFinal]`), donde la primera posición es la fecha inicial y la segunda la fecha final.
 * @param props.columnId - Identificador de la columna asociada.
 * @param props.itemId - Identificador del ítem asociado.
 *
 * @returns Un componente visual que permite seleccionar un rango de fechas y muestra el progreso entre ellas.
 */
export const TimeLine = ({ value, columnId, itemId }: Props) => {
  const calendarRef = useRef<Calendar>(null);
  const userActions = useRoleUserActions((state) => state.userActions);
  const { id: boardId, viewId } = useParams() as { id: string; viewId: string };
  const [percentage, setPercentage] = useState<number>(0);
  const [datesLabel, setDatesLabel] = useState<string>("Sin definir");
  const [dates, setDates] = useState<Nullable<Date | (Date | null)[]>>(
    formatTimeLineItemValue(value)
  );

  useEffect(() => {
    if (
      (Array.isArray(dates) && dates.some((date) => date === null)) ||
      !dates
    ) {
      return;
    }

    setPercentage(calculatePercentageBetweenDates(dates as Date[]));
    const formatedDates = (dates as Date[]).map((date) =>
      date.toLocaleDateString("en-EN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    );
    setDatesLabel(formatedDates.join(" - "));
  }, [dates]);

  const handleSelectDates = async (dates: Date[]) => {
    if (!dates || (Array.isArray(dates) && dates.some((date) => date === null)))
      return;

    await setTableValue(
      boardId,
      viewId,
      itemId,
      columnId,
      dates ? JSON.stringify(dates.map((date) => date.toISOString())) : ""
    );
  };

  const handleShowCalendar = () => {
    if (!userActions?.includes("update") || !userActions?.includes("create"))
      return;
    calendarRef.current?.show();
  };

  return (
    <article className={styles.container}>
      <section className={styles.calendarContainer}>
        <Calendar
          value={dates}
          onChange={(e) => {
            setDates(e.value);
            handleSelectDates(e.value as Date[]);
          }}
          selectionMode="range"
          readOnlyInput
          hideOnRangeSelection
          ref={calendarRef}
          inputStyle={{ width: "100%", height: "100%" }}
          style={{ width: "100%", height: "100%" }}
        />
      </section>
      <section className={styles.progressbarContainer}>
        <>
          <ProgressBar
            value={percentage}
            style={{ width: "100%", height: "100%", cursor: "pointer" }}
            showValue={false}
            onClick={handleShowCalendar}
          ></ProgressBar>
          <p className={styles.datesLabel} onClick={handleShowCalendar}>
            {datesLabel}
          </p>
        </>
      </section>
    </article>
  );
};
