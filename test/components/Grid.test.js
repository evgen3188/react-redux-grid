import expect from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { keyGenerator } from '../../src/util/keygenerator';
import { Grid } from '../../src/components/Grid.jsx';
import { setup, mockStore, mockReducer } from '../util/index';
import { gridColumns, localGridData, gridActions } from '../util/data';


const props = {
    data: localGridData,
    columns: gridColumns,
    store: mockStore({}, ...gridActions)
};

props.store.subscribe = () => {};

function grid(cmpProps) {
    const element = React.createElement(Grid, cmpProps);
    const renderer = TestUtils.createRenderer();
    renderer.render(element);
    return renderer.getRenderOutput();
}

function subcomponent(container, cls) {
    return container.props.children
        .filter((child) => child.props.className === cls);
}

describe('Grid Function Execution', () => {
    const grid = <Grid { ...props } />;
    const internalProps = grid.props;

    it('Should be rendered with correct default props', () => {

        expect(internalProps.columns).toEqual(props.columns);
        expect(internalProps.data).toEqual(props.data);
        expect(internalProps.pageSize).toEqual(25);

    });

});

describe('Grid to error without a store and/or columns', () => {

    const propsWithoutStore = {
        data: localGridData,
        columns: gridColumns
    };

    const propsWithoutColumns = {
        data: localGridData,
        store: mockStore({}, ...gridActions)
    };

    it('Should throw an error without a store', () => {
        expect(grid.bind(grid, propsWithoutStore)).toThrow('Component must be intialized with a valid store');
    });

    it('Should throw an error without columns array', () => {
        expect(grid.bind(grid, propsWithoutColumns)).toThrow('A columns array is required');
    });

    it('Should note throw an error', () => {
        expect(grid.bind(grid, props)).toBeTruthy();
    });

});

describe('Grid DOM after render', () => {

    const component = grid(props);
    const container = component.props.children[0];

    it('Should be rendered in the correct container type', () => {
        expect(component.type).toEqual('div');
        expect(component.key).toEqual(null);
        expect(component.props.children).toBeTruthy();
    });

    it('Should be rendered in the correct container', () => {
        expect(container).toBeTruthy();
        expect(container.props.className).toEqual('react-grid-container');
    });

    it('Should have 5 child elements', () => {
        expect(container.props.children.length).toEqual(5);
    });

    it('Should render the correct table', () => {
        const table = subcomponent(container, 'react-grid-table');

        expect(table).toBeTruthy();
        expect(table.length).toEqual(1);
        expect(table[0].props.store).toBeTruthy();
    });

    it('Should render the correct table', () => {
        const table = subcomponent(container, 'react-grid-table');

        expect(table).toBeTruthy();
        expect(table.length).toEqual(1);
        expect(table[0].props.store).toBeTruthy();
    });

    it('Should render no error container', () => {
        const errorContainer = subcomponent(container, 'react-grid-error-container');
        expect(errorContainer.length).toEqual(0);
    });

    it('Should render no filter container', () => {
        const errorContainer = subcomponent(container, 'react-grid-filter-container');
        expect(errorContainer.length).toEqual(0);
    });

    it('Should render no loading bar', () => {
        const errorContainer = subcomponent(container, 'react-grid-loading-bar');
        expect(errorContainer.length).toEqual(0);
    });


    it('Should render the filter container', () => {

        const propsWithFilterContainer = Object.assign(props, {
            PLUGINS: {
                FILTER_CONTAINER: {
                    enabled: true
                }
            }
        });

        console.log(propsWithFilterContainer)

        // const gridWithPlugins = grid(propsWithFilterContainer);
        // const gridWithPluginsContainer = gridWithPlugins.props.children[0];

        // const errorContainer = subcomponent(gridWithPluginsContainer, 'react-grid-filter-container');
        // expect(errorContainer.length).toEqual(1);
    });





});