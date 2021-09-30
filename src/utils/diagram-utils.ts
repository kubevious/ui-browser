const LAYER_COLOR_TABLE_01 = [
    '#121213',
    '#1E1E1E'
];

// const LAYER_COLOR_TABLE_02 = [
//     '#1E1E1E',
//     '#B43572',
//     '#1E1E1E',
//     '#4F6EC9',
// ];

// const LAYER_COLOR_TABLE_GRAYSCALE = [
//     // '#1E1E1E',
//     '#292929',
//     '#1F1F1F',
//     '#333333',
// ];

const LAYER_COLOR_TABLE = LAYER_COLOR_TABLE_01;
// const LAYER_COLOR_TABLE = LAYER_COLOR_TABLE_02;
// const LAYER_COLOR_TABLE = LAYER_COLOR_TABLE_GRAYSCALE;


export function getLayerColor(index: number) : string
{
    return LAYER_COLOR_TABLE[index % LAYER_COLOR_TABLE.length]
}


