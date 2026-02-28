import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgToggleModule } from 'ng-toggle-button';

export const SHARED_IMPORTS = [
    CardComponent,
    MatTableModule,
    MatPaginatorModule,
    MatIcon,
    NgSelectModule,
    MatInputModule,
    MatFormFieldModule,
    NgToggleModule,
];
