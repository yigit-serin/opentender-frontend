import {Component} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {IStatsNuts} from '../../app.interfaces';
import {NotifyService} from '../../services/notify.service';
import {I18NService} from '../i18n/services/i18n.service';
import {ConfigService} from '../../services/config.service';
import {PlatformService} from '../../services/platform.service';

@Component({
	moduleId: __filename,
	selector: 'home-nutsmap',
	template: `
		<div class="graph-header">
			<div class="graph-title">{{title}}</div>
			<div class="graph-toolbar-container">
				<div class="graph-toolbar graph-toolbar-left">
					<button class="tool-button" [ngClass]="{down:!map_companies}" (click)="toggle()" i18n>Buyers</button>
					<button class="tool-button" [ngClass]="{down:map_companies}" (click)="toggle()" i18n>Suppliers</button>
				</div>
				<div class="graph-toolbar graph-toolbar-right">
					<button class="tool-button" [ngClass]="{down:map_level==0}" (click)="setLevel(0)" i18n>Countries</button>
					<button class="tool-button" [ngClass]="{down:map_level==1}" (click)="setLevel(1)" i18n>NUTS 1</button>
					<button class="tool-button" [ngClass]="{down:map_level==2}" (click)="setLevel(2)" i18n>NUTS 2</button>
					<button class="tool-button" [ngClass]="{down:map_level==3}" (click)="setLevel(3)" i18n>NUTS 3</button>
				</div>
			</div>
		</div>
		<graph nutsmap [data]="map_data" [level]="map_level" [formatTooltip]="formatTooltip" [title]="title"></graph>
	`
})
export class MapHomeComponent {
	public map_level: number = 2;
	public map_companies: boolean = false;
	public map_data: IStatsNuts = null;
	public formatTooltip: (featureProperties: any) => string;
	public loading: number = 0;
	public title: string = '';

	constructor(private api: ApiService, private notify: NotifyService, private i18n: I18NService, private config: ConfigService, private platform: PlatformService) {
		this.formatTooltip = this.formatTooltipCallback.bind(this);
		this.fillMap(this.map_level);
	}

	toggle() {
		this.map_companies = !this.map_companies;
		this.fillMap(this.map_level);
	}

	getTitle() {
		return this.map_companies ? this.i18n.get('Number of Suppliers by Region') : this.i18n.get('Number of Buyers by Region');
	}

	formatTooltipCallback(featureProperties) {
		return featureProperties.name + ': ' + featureProperties.value + ' ' + (this.map_companies ? this.i18n.get('Suppliers') : this.i18n.get('Buyers'));
	}

	fillMap(level) {
		this.title = this.getTitle();
		if (!this.platform.isBrowser) {
			return;
		}
		if (this.map_companies) {
			this.loading++;
			let sub = this.api.getCompanyNutsStats().subscribe(
				(result) => {
					this.map_level = level;
					this.map_data = result.data;
				},
				(error) => {
					this.notify.error(error);
				},
				() => {
					this.loading--;
					sub.unsubscribe();
				}
			);
		} else {
			this.loading++;
			let sub = this.api.getAuthorityNutsStats().subscribe(
				(result) => {
					this.map_level = level;
					if (['eu', 'all'].indexOf(this.config.country.id) < 0) {
						let filtered = {};
						let id = this.config.country.id;
						if (id === 'gr') {
							id = 'el';
						}
						Object.keys(result.data).forEach(key => {
							if (key.indexOf(id) === 0) {
								filtered[key] = result.data[key];
							}
						});
						this.map_data = filtered;
					} else {
						this.map_data = result.data;
					}
				},
				(error) => {
					this.notify.error(error);
				},
				() => {
					this.loading--;
					sub.unsubscribe();
				}
			);
		}
	}

	setLevel(level) {
		this.map_level = level;
		// this.fillMap(level);
	}
}
