import styles from './styles.module.css';
import { Tooltip } from '@/components/common/tooltip/tooltip';
import { IoPersonCircle } from "react-icons/io5";
import { FaFilter } from "react-icons/fa";
import { ImSortAmountAsc } from "react-icons/im";
import { BiSolidHide } from "react-icons/bi";
import { FaObjectGroup } from "react-icons/fa";
import { SearchInput } from '../searchInput/searchInput';

export const FiltersBar = () => {
  return (
    <article className={styles.container}>
      <SearchInput/>

      <Tooltip text="Filtra los grupos por persona">
        <article className={styles['container-item']}>
          <IoPersonCircle/>
          <p>Persona</p>
        </article>
      </Tooltip>

      <Tooltip text="Define cualquier filtro">
        <article className={styles['container-item']}>
          <FaFilter/>
          <p>Filtros</p>
        </article>
      </Tooltip>

      <Tooltip text="Ordena por columna">
        <article className={styles['container-item']}>
          <ImSortAmountAsc/>
          <p>Ordenar</p>
        </article>
      </Tooltip>

      <Tooltip text="Oculta columnas">
        <article className={styles['container-item']}>
          <BiSolidHide/>
          <p>Ocultar</p>
        </article>
      </Tooltip>

      <Tooltip text="Agrupa items por columna">
        <article className={styles['container-item']}>
          <FaObjectGroup/>
          <p>Agrupar por</p>
        </article>
      </Tooltip>
    </article>
  );
}