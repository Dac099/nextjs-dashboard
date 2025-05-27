import { Calendar } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';
import { useState } from 'react';

type Props = {
  callback: (value: string) => void;
};

export function DateColumn({ callback }: Props) {
  const [date, setDate] = useState<Nullable<Date>>(null);
  
  const handleDateSelect = (value: Nullable<Date>) => {
    setDate(value);

    if(value){
      callback(JSON.stringify(new Date(value).toISOString()));
    }
  };

  return (
    <Calendar 
      dateFormat='dd/mm/yy'
      onChange={(e) => handleDateSelect(e.value)}
      hideOnDateTimeSelect
      value={date}
      style={{
        width: '100%',
        height: '100%',

      }}
      inputStyle={{
        width: '100%',
        height: '100%',
        border: 'none',
        outline: 'none',
        margin: '0',
        display: 'block',
        textAlign: 'center'
      }}
    />
  );
}