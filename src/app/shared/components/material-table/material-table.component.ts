import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    input,
    InputSignal,
    viewChild
} from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { ColumnConfig } from '@shared/interfaces';
import { TableData } from '@shared/types';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-material-table',
    standalone: true,
    imports: [MatTableModule, MatSortModule],
    templateUrl: './material-table.component.html',
    styleUrl: './material-table.component.less'
})
export class MaterialTableComponent {

    public columns: InputSignal<ColumnConfig[]> = input.required();
    public tableData: InputSignal<TableData> = input.required();

    protected displayedColumns = computed(() => 
        this.columns().map(columns => columns.key)
    );
    protected dataSource = new MatTableDataSource<any>([]);
    protected sort = viewChild(MatSort);

    constructor() {
        effect(() => {
            this.dataSource.data = this.tableData();
        });
    }

    ngAfterViewInit() {
        queueMicrotask(() => {
            if (this.sort()) {
                this.dataSource.sort = this.sort()!;
            }
        });
    }
}