import {Component, OnInit, OnDestroy} from '@angular/core';
import {Search} from '../../../model/search';
import {StateService} from '../../../services/state.service';
import {AuthorityFilterDefs, isSearchDef} from '../../../model/filters';
import {ISearchResultAuthority, ISearchFilterDefType, ISearchCommand} from '../../../app.interfaces';
import {I18NService} from '../../../modules/i18n/services/i18n.service';

@Component({
	moduleId: __filename,
	selector: 'search_authority',
	templateUrl: 'authority.component.html'
})
export class SearchAuthorityPage implements OnInit, OnDestroy {
	title = '';
	search = new Search('authority');
	search_cmd: ISearchCommand;
	columnIds = ['id', 'body.name', 'body.address.city', 'body.mainActivities', 'body.buyerType'];
	filterIds = ['body.name', 'body.address.city', 'body.mainActivities', 'body.buyerType'];
	filters = AuthorityFilterDefs;

	constructor(private state: StateService, private i18n: I18NService) {
		this.search.build(this.filters.filter(isSearchDef), this.filters.filter(def => {
			return this.filterIds.indexOf(def.id) >= 0;
		}));
		this.setTitle();
	}

	ngOnInit(): void {
		let state = this.state.get('search.authority');
		if (state) {
			this.columnIds = state.columnIds;
			this.search = state.search;
			this.search_cmd = state.search_cmd;
		} else {
			this.refresh();
		}
	}

	ngOnDestroy() {
		this.state.put('search.authority', {
			columnIds: this.columnIds,
			search: this.search,
			search_cmd: this.search_cmd
		});
	}

	setTitle(total?) {
		this.title = this.i18n.get('Authorities') + (total !== null ? ': ' + this.i18n.formatValue(total) : '');
	}

	searchChange(data: ISearchResultAuthority) {
		let total = data.hits && data.hits.total ? data.hits.total : 0;
		this.setTitle(total);
		this.search.fillAggregationResults(data.aggregations);
	}

	columnsChange(data: { columns: Array<string> }) {
		this.columnIds = data.columns;
	}

	refresh() {
		this.search_cmd = this.search.getCommand();
	}
}
