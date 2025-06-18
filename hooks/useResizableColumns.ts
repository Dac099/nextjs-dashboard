import {useEffect} from "react";

export const useResizableColumns = () => {
    useEffect(() => {
        const tables = document.getElementsByTagName('table');

        if(tables.length === 0) return;

        const createResizerElement = (tableHeight: number) => {
            const resizerElement = document.createElement('div');
            resizerElement.className = 'column-resizer';
            resizerElement.style.top = '0';
            resizerElement.style.right = '-2px';
            resizerElement.style.width = '4px';
            resizerElement.style.position = 'absolute';
            resizerElement.style.cursor = 'col-resize';
            resizerElement.style.backgroundColor = 'transparent';
            resizerElement.style.userSelect = 'none';
            resizerElement.style.height = `${tableHeight}px`;
            resizerElement.style.zIndex = '10';
            return resizerElement;
        }

        // Función para sincronizar el ancho de columnas entre todas las tablas
        const syncColumnWidths = (columnIndex: number, newWidth: number) => {
            Array.from(tables).forEach(table => {
                // Configurar la tabla para layout fijo
                table.style.tableLayout = 'fixed';
                table.style.width = 'max-content';

                const firstRow = table.getElementsByTagName('tr')[0];
                if (firstRow) {
                    const cells = firstRow.getElementsByTagName('th');
                    if (cells[columnIndex]) {
                        cells[columnIndex].style.width = `${newWidth}px`;
                        cells[columnIndex].style.minWidth = `${newWidth}px`;
                        cells[columnIndex].style.maxWidth = `${newWidth}px`;
                    }
                }
            });
        };

        const setListeners = (resizerElement: HTMLDivElement, columnIndex: number) => {
            let isResizing = false;
            let startX: number;
            let startWidth: number;

            const handleMouseDown = (e: MouseEvent) => {
                isResizing = true;
                startX = e.clientX;

                // Obtener el ancho actual de la columna
                const parentTh = resizerElement.parentElement as HTMLTableCellElement;
                startWidth = parentTh.offsetWidth;

                document.body.style.cursor = 'col-resize';
                document.body.style.userSelect = 'none';

                e.preventDefault();
            };

            const handleMouseMove = (e: MouseEvent) => {
                if (!isResizing) return;

                const diffX = e.clientX - startX;
                const newWidth = Math.max(120, startWidth + diffX); // Mínimo 120px

                // Sincronizar el ancho en todas las tablas
                syncColumnWidths(columnIndex, newWidth);

                e.preventDefault();
            };

            const handleMouseUp = () => {
                if (!isResizing) return;

                isResizing = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            };

            resizerElement.addEventListener('mousedown', handleMouseDown);
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            // Cleanup function para remover listeners
            return () => {
                resizerElement.removeEventListener('mousedown', handleMouseDown);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        };

        const resizableGrid = (table: HTMLTableElement) => {
            // Verificar si ya se procesó esta tabla
            if (table.hasAttribute('data-resizable')) return;

            // Configurar la tabla para layout fijo
            table.style.tableLayout = 'fixed';
            table.style.width = 'max-content';

            const firstRow = table.getElementsByTagName('tr')[0];
            const cells = firstRow?.getElementsByTagName('th');

            if(!cells || cells.length === 0) return;      // Inicializar anchos por defecto para todas las columnas
            Array.from(cells).forEach((cell, index) => {
                const defaultWidth = index === 0 ? 200 : 120; // Primera columna más ancha
                cell.style.width = `${defaultWidth}px`;
                cell.style.minWidth = `${defaultWidth}px`;
                cell.style.maxWidth = `${defaultWidth}px`;
            });

            // Agregar resizers a todas las columnas excepto la última
            for(let i = 0; i < cells.length - 1; i++){
                const column = cells[i];

                // Verificar si ya tiene un resizer
                if (!column.querySelector('.column-resizer')) {
                    const resizerElement = createResizerElement(table.offsetHeight);
                    column.appendChild(resizerElement);
                    column.style.position = 'relative';

                    // Configurar listeners con el índice de la columna
                    setListeners(resizerElement, i);
                }
            }

            // Marcar la tabla como procesada
            table.setAttribute('data-resizable', 'true');
        };

        // Procesar todas las tablas
        Array.from(tables).forEach(table => {
            resizableGrid(table);
        });

    }, []);
}