export enum CellValue{
    none,
    one,
    two,
    three,
    four,
    five,
    six,
    seven,
    eight,
    bomb
}

export enum CellState{
    Transparent,
    visible,
    flagged, 
    question
}

export type Cell = {value: CellValue, state: CellState};
