import React, { Component } from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import FontIcon from 'react-toolbox/lib/font_icon';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import axios from "axios";

import { LOCATION_DIALOG_TEXT } from "../../configs";
import calUrl from "../../utils/cal-url.js";
import _ from 'lodash';

import css from './index.scss';

export default class Location extends Component {
    constructor() {
        super();

        this.state = {
            showModal: false,
            regionalList: [],
            locationNamesMap: [],
            loading: false,
            level: 0,
            selectedLocation: {
                id: null,
                name: null
            },
            currentSelected: null
        };

        this.actions = [
            { label: this.context.d2.i18n.getTranslation('cancel'), onClick: ::this.handleToggle },
            { label: this.context.d2.i18n.getTranslation('ok'), onClick: this.handleToggle.bind(this, 'OK') }
        ];
    }

    componentDidMount() {
        this.initList();
    }

    static contextTypes = {
        d2: React.PropTypes.object
    };

    initList() {
        let regionalList = [];

        this.setState({ loading: true });
        axios.all([
            axios.get(calUrl.getLocationMapping(), calUrl.getConfig()),
            axios.get(calUrl.getRelatedOuList(), calUrl.getConfig())
        ]).then(([mapResult, listResult]) => {
            const map = _.get(mapResult, 'data.organisationUnits', []);
            const list = _.get(listResult, 'data.organisationUnits', []);

            list.forEach((item) => {
                const location = _.find(map, item);
                if(location) {
                    regionalList.push(location)
                }
            });

            const defaultSelected = { id: regionalList[0].id, name: regionalList[0].displayName };

            this.setState({
                regionalList,
                locationNamesMap: map,
                loading: false,
                selectedLocation: defaultSelected,
                currentSelected: defaultSelected
            });

            this.props.onSelect && this.props.onSelect(defaultSelected);

            if(regionalList.length) {
                return axios.get(calUrl.getOuLevel(regionalList[0].id))
                    .then((response) => {
                        this.setState({ level: response.data.level - 1 })
                    })
            }
        }).catch(() => {
            this.setState({ loading: false });
        });
    }

    handleToggle(status) {
        this.setState({ showModal: !this.state.showModal });
        if(status == 'OK') {
            this.setState({ currentSelected: this.state.selectedLocation });
            this.props.onSelect && this.props.onSelect(this.state.selectedLocation);
        }
    }

    fetchChild(item, enableFetch) {
        const selectedLocation = {
            id: item.id,
            name: item.displayName
        };

        this.setState({ selectedLocation });
        if(!enableFetch) {
            return;
        }

        if(item.showChildren || item.children) {
            item.showChildren = !item.showChildren;
            return this.forceUpdate();
        }

        this.setState({ loading: true });

        axios.get(calUrl.getChildrenUrl(item.id), calUrl.getConfig())
            .then((res) => {
                const list = _.get(res, 'data.children', []);
                const childrenList = [];

                list.forEach((item) => {
                    const location = _.find(this.state.locationNamesMap, item);
                    if(location) {
                        childrenList.push(location)
                    }
                });

                item.children = childrenList;
                item.showChildren = true;
                this.setState({ loading: false });
            }).catch(() => {
            this.setState({ loading: false });
        });
    }

    onClean(evt) {
        this.setState({ currentSelected: null });
        evt.stopPropagation();
    }

    renderLocationList(list, level = 0) {
        return (<div>
            {
                list.map((item, idx) => {
                    const iconStyle = { verticalAlign: 'middle' };
                    const classString = `${css.regionalList} ${(this.state.selectedLocation.id == item.id ? css.selected : '')}`;
                    let icon;

                    if((this.state.level + level) > 2) {
                        icon = <span style={{ ...iconStyle, marginLeft: (level + 1) * 20 + 'px' }}/>
                    } else {
                        icon = <FontIcon style={{
                            ...iconStyle,
                            marginLeft: (level) * 20 + 'px'
                        }}>{ item.showChildren ? 'expand_more' : 'chevron_right' }</FontIcon>;
                    }

                    return (
                        <div>
                            <div key={idx} className={ classString }
                                 onClick={ this.fetchChild.bind(this, item, (this.state.level + level) <= 2) }>
                                { icon }
                                { item.displayName }
                            </div>
                            { !!item.showChildren && this.renderLocationList(item.children, (level + 1)) }
                        </div>
                    )
                })
            }
        </div>)
    }

    render() {
        const { currentSelected, showModal, regionalList } = this.state;

        return (
            <div>
                <div className={ css.locationContainer }>
                    <div className={ css.location } onClick={ ::this.handleToggle }>
                        <label
                            className={ `${css.locationLabel} ${currentSelected ? css.hasLocation : ''}` }>{this.context.d2.i18n.getTranslation('location')}</label>
                        <div>{currentSelected == null ? '' : currentSelected.name}</div>
                        { currentSelected !== null &&
                        <FontIcon className={ css.clear } onClick={ ::this.onClean } name="clear">clear</FontIcon> }
                    </div>
                </div>
                <Dialog
                    className={ css.locationDialog }
                    actions={this.actions}
                    active={showModal}
                    onEscKeyDown={::this.handleToggle}
                    onOverlayClick={::this.handleToggle}
                >
                    <div className={ css.dialogTitle }>{this.context.d2.i18n.getTranslation(LOCATION_DIALOG_TEXT)}</div>
                    <div className={ (this.state.loading ? css.loading : css.hide) }>
                        <ProgressBar type='circular' mode='indeterminate' multicolor/>
                    </div>
                    <div className={css.content}>
                        { ::this.renderLocationList(regionalList) }
                    </div>
                </Dialog>
            </div>
        )
    }
}
