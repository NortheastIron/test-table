import { CommonModule } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { finalize } from 'rxjs';

import { CustomTableComponent, MaterialTableComponent } from '@shared';
import { ColumnConfig } from '@shared/interfaces';
import { Route } from '@core';

import { RoutesService } from '@features/routes/list/services';

@Component({
    selector: 'app-routes-list',
    standalone: true,
    imports: [
        CommonModule,
        MatSlideToggleModule,
        CustomTableComponent,
        MaterialTableComponent,
        MatProgressSpinnerModule,
        MatButtonModule,
    ],
    templateUrl: './routes.list.component.html',
    styleUrl: './routes.list.component.less',
    providers: [RoutesService]
})
export class RoutesListComponent {

    private _routesService = inject(RoutesService);

    protected columns = signal<ColumnConfig[]>([
        { key: 'address', name: 'Адрес назначения', sort: true },
        { key: 'gateway', name: 'Шлюз', sort: true },
        { key: 'interface', name: 'Интерфейс', sort: true },
    ]);

    protected routes = signal<Route[]>([]);
    protected isShowMaterial = false;
    protected isLoading = signal<boolean>(false);
    protected error = signal<string | null>(null);

    ngOnInit() {
        this.loadData();
    }

    protected onSlide(): void {
        this.isShowMaterial = !this.isShowMaterial;
    }

    protected loadData(): void {
        this.isLoading.set(true);
        this.error.set(null);

        this._routesService.getRoutesList().pipe(
            finalize(() => this.isLoading.set(false))
        ).subscribe({
            next: (data: Route[]) => {
                this.routes.set(data);
            },
            error: (err) => {
                this.error.set('Ошибка загрузки данных. Попробуйте ещё раз.');
                console.error(err);
            }
        });
    }
}
