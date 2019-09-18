import {createSelector} from 'reselect';

const selectMap = state => state.map;

export const selectMapBoundary = createSelector(
    [selectMap],
    (map) => map.boundary
)

