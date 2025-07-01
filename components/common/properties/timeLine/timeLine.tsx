"use client";

import styles from "./styles.module.css";
import { Calendar } from "primereact/calendar";
import { useEffect, useState, useRef } from "react";
import { ProgressBar } from "primereact/progressbar";
import { useRoleUserActions } from "@/stores/roleUserActions";
import { Nullable } from "primereact/ts-helpers";
import { calculatePercentageBetweenDates } from "@/utils/helpers";
import { formatTimeLineItemValue } from "@/utils/helpers";
import { ColumnData, ItemData, ItemValue } from '@/utils/types/views';
import { setTimeLineValue } from './actions';

type Props = {
  value: ItemValue | undefined;
  column: ColumnData;
  item: ItemData;
};

export const TimeLine = ({ value, column, item }: Props) => {
  const calendarRef = useRef<Calendar>(null);
  const userActions = useRoleUserActions((state) => state.userActions);
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
    const parsedValues = JSON.stringify(dates.map((date) => date.toISOString()));
    try{
      await setTimeLineValue(item, column, {
        ...value,
        value: parsedValues,
      } as ItemValue);
    }catch (error) {
      console.log(error);
      return;
    }
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
