import {Option, Some} from "@rustynova/monads";


export class Collection<T> extends Array<T> {
    /** Insert elements at the provided index. Elements already in the array will be shifted */
    insertAt(index: number, value: T) {
        return this.splice(index, 0, value);
    }

    /** Return true if the collection include one of the values provided */
    public includeOneOf(otherValues: T[]){
        return otherValues.some(otherValue => this.includes(otherValue));
    }

    /** Remove a value from the collection if it exists */
    public remove(value: T) {
        const index = this.indexOf(value);
        if (index === -1) {return this;}
        this.removeAt(index);
        return this;
    }

    /** Remove item at the provided index */
    removeAt(index: number) {
        this.splice(index, 1);
        return this;
    }

    public removeUndefined(): Exclude<T, undefined>[] {
        return super.filter((value: T | undefined): value is Exclude<T, undefined> => value !== undefined);
    }

    public set(array: T[]): this {
        this.splice(0, this.length, ...array);
        return this;
    }

    public override filter<thisArgType>(predicate: (value: T, index: number, array: T[]) => boolean, thisArg?: thisArgType) {
        return new Collection<T>(...super.filter(predicate, thisArg));
    }

    public override map<U, thisArgType>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: thisArgType) {
        return new Collection(...super.map(callbackfn, thisArg));
    }
    
    public findAsOption(predicate: (value: T, index: number, obj: T[]) => unknown): Option<T> {
        return Some(this.find(predicate));
    }

    public at(index: number): Option<T> {
        return Some(super.at(index));
    }
}

export function isUndefined(value: any): value is undefined {
    return value === undefined;
}

