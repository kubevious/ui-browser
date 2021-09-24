const LAYER_COLOR_TABLE_01 = [
    '#7C90BF',
    // '#F58D61',
    '#66C2A5',
    '#80B1D2',
    '#A6D853',
    '#E2A78E',
    '#E789C2',
    '#BDB9DA',
    '#BD7637',
    '#D23AEE',
    '#8331CB',
    '#BBBBBB',
];

const LAYER_COLOR_TABLE_GRAYSCALE = [
    // '#1E1E1E',
    '#292929',
    '#1F1F1F',
    '#333333',
];

// const LAYER_COLOR_TABLE = LAYER_COLOR_TABLE_01;
const LAYER_COLOR_TABLE = LAYER_COLOR_TABLE_GRAYSCALE;


export function getLayerColor(index: number) : string
{
    return LAYER_COLOR_TABLE[index % LAYER_COLOR_TABLE.length]
}


