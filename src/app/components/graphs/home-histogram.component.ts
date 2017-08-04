import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {IChartBar} from '../../thirdparty/ngx-charts-universal/chart.interface';
import {IStatsLotsInYears} from '../../app.interfaces';
import {Utils} from '../../model/utils';
import {Consts} from '../../model/consts';

@Component({
	selector: 'graph[home-histogram]',
	template: `
		<div class="graph-title">Available Contracts (Lots) per Year</div>
		<ngx-charts-bar-vertical
				class="chart-container"
				[chart]="graph.chart"
				[data]="graph.data"
				(select)="graph.select($event)"
				(legendLabelClick)="graph.onLegendLabelClick($event)">
		</ngx-charts-bar-vertical>`
})
export class GraphHomeHistogramComponent implements OnChanges {
	@Input()
	data: IStatsLotsInYears;

	lots_in_years = {
		chart: {
			schemeType: 'ordinal',
			view: {
				def: {width: 1024, height: 320},
				min: {height: 320},
				max: {height: 320}
			},
			xAxis: {
				show: true,
				showLabel: true,
				label: 'Years',
				defaultHeight: 20,
				tickFormatting: Utils.formatYear
			},
			yAxis: {
				show: true,
				showLabel: true,
				label: 'Number of Contracts (Lots)',
				defaultWidth: 44,
				minInterval: 1,
				tickFormatting: Utils.formatValue
			},
			showGridLines: true,
			gradient: false,
			colorScheme: {
				domain: Consts.colors.single
			}
		},
		select: (event) => {
		},
		onLegendLabelClick: (event) => {
		},
		data: null
	};

	graph: IChartBar = this.lots_in_years;

	constructor() {
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.lots_in_years.data = null;
		if (this.data) {
			this.lots_in_years.data = Object.keys(this.data).map((key) => {
				return {name: key, value: this.data[key]};
			});
		}
	}

}
