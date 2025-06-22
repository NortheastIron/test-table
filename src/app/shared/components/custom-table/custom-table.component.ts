import { CommonModule } from '@angular/common';
import { Component, computed, effect, input, InputSignal, signal, Signal, WritableSignal } from '@angular/core';

import { ColumnConfig } from '@shared/interfaces';
import { TableData } from '@shared/types';

import { SortDirections } from './enums';

@Component({
    selector: 'app-custom-table',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './custom-table.component.html',
    styleUrl: './custom-table.component.less'
})
export class CustomTableComponent {
    public columns: InputSignal<ColumnConfig[]> = input.required();
    public tableData: InputSignal<TableData> = input.required();

    protected hoveredColumn: string | null = null;
    protected sortState: WritableSignal<{
        column: string;
        direction: SortDirections | null;
    } | null> = signal(null);

    protected sortedData: Signal<TableData> = computed(() => {
        const data = this.tableData();
        const sortState = this.sortState();
        if (!sortState || !sortState.direction) {
            return data;
        }

        const column = sortState.column;
        const direction = sortState.direction;

        return [...data].sort((a, b) => {
            const valA = a[column];
            const valB = b[column];
            let result = 0;
                
            if (typeof valA === 'string' && typeof valB === 'string') {
                result = valA.localeCompare(valB);
            } else {
                result = (valA < valB) ? -1 : (valA > valB) ? 1 : 0;
            }

            return direction === SortDirections.asc ? result : -result;
        });
    });

    constructor() {
        effect(() => {
            this.columns();
            this.tableData();
            this.resetSort();
        });
    }

    protected setHoveredCol(colKey: string | null, colSort?: boolean): void {
        if (colKey && colSort) {
            this.hoveredColumn = colKey;
        } else {
            this.hoveredColumn = null;
        }
    }

    protected getIconClass(colKey: string): Record<string, boolean> {
        const sortState = this.sortState();
        const isActive = sortState?.column === colKey;
        const isHovered = this.hoveredColumn === colKey;
        const isAscActive = isActive && sortState?.direction === SortDirections.asc;
        const isDescActive = isActive && sortState?.direction === SortDirections.desc;

        return {
            'icon-up': !isDescActive,
            'icon-down': isDescActive,
            'icon--hidden': !isActive && !isHovered,
            'icon--active': isAscActive || isDescActive
        };
    }

    protected handleSortClick(colKey: string, colSort?: boolean): void {
        if (!colSort || !this.tableData()?.length) {
            return;
        }

        const currentSortState = this.sortState();

        if (!currentSortState || currentSortState.column !== colKey) {
            this.sortState.set({
                column: colKey,
                direction: SortDirections.asc
            });

        } else {
            switch (currentSortState.direction) {
                case SortDirections.asc:
                    this.sortState.set({
                        ...currentSortState,
                        direction: SortDirections.desc
                    });
                    break;
                case SortDirections.desc:
                    this.sortState.set(null);
                    break;
                default: 
                    this.sortState.set({
                        ...currentSortState,
                        direction: SortDirections.asc
                    });
            }
        }
    }

    protected resetSort() {
        this.sortState.set(null);
    }

}
