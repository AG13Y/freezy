

import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { contacts } from './simple.model';

@Component({
  selector: 'ngm-dev-block-simple-stacked-list',
  templateUrl: './simple.component.html',
  styleUrls: ['./simple.component.scss'],
  imports: [MatListModule, MatDividerModule],
})
export class SimpleStackedListComponent {
  contacts = contacts;
}
