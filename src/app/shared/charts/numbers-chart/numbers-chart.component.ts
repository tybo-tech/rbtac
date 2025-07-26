import { NgFor, TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-numbers-chart',
  templateUrl: './numbers-chart.component.html',
  styleUrls: ['./numbers-chart.component.scss'],
  imports: [NgFor, TitleCasePipe],
})
export class NumbersChartComponent {
  @Input() items:IKeyValue[] = [
    {
      key: 'Total Wins',
      value: '1000',
    },
    {
      key: 'Total Draws',
      value: '100',
    },
    {
      key: 'Total Losses',
      value: '500',
    },
  ];

  @Output() itemClicked = new EventEmitter<IKeyValue>();
}

export interface IKeyValue {
  key: string;
  value: string;
}