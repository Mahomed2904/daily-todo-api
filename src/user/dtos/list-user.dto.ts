export interface FilterParamsDTO {
    name: string | undefined;
    maxSize: number | undefined;
    groupBy: string | undefined;
}

export class FilterParams implements FilterParamsDTO {
    public name: string;
    public maxSize: number;
    public groupBy: string;

    constructor({ name, maxSize, groupBy }: FilterParamsDTO) {
        if (!name) this.name = '';
        if (!maxSize) this.maxSize = 64;
        if (!groupBy) this.groupBy = 'startAt';
    }
}
