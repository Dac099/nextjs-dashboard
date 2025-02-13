import { TbTableFilled } from "react-icons/tb";
import { FaChartGantt } from "react-icons/fa6";
import { IoBarChartSharp } from "react-icons/io5";
import { SiFiles } from "react-icons/si";
import { IoCalendar } from "react-icons/io5";

export function getIconByName(name: string) {
  switch (name) {
    case 'main':
      return <TbTableFilled />;
    case 'gantt':
      return <FaChartGantt />;
    case 'barchart':
      return <IoBarChartSharp />;
    case 'files':
      return <SiFiles />;
    case 'calendar':
      return <IoCalendar />;
    default:
      return <TbTableFilled />;
  }
}
