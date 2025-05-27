import React, { useState } from "react";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";

type Props = {
  callback: (value: string) => void;
};

export default function TimeLineColumn({ callback }: Props) {
  const [dates, setDates] = useState<Nullable<(Date | null)[]>>(null);

  const handleDateChange = (e: Nullable<(Date | null)[]>) => {
    setDates(e);
    callback(JSON.stringify(e ? e.map((date) => date?.toISOString() || "") : []));
  };

  return (
    <Calendar
      value={dates}
      onChange={(e) => handleDateChange(e.value)}
      selectionMode="range"
      readOnlyInput
      hideOnRangeSelection
      style={{
        width: "100%",
        height: "100%",
      }}
      inputStyle={{
        width: "100%",
        height: "100%",
        border: "none",
        outline: "none",
        margin: "0",
        display: "block",
        textAlign: "center",
      }}
    />
  );
}
