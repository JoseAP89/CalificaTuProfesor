export class Scale {
    scaleId : number;
    description: string;
    name: string;

    constructor(scaleId: number, name: string, description: string) {
        this.scaleId = scaleId;
        this.name = name;
        this.description = description;
    }

}