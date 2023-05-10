import {Ok, Result} from "@rustynova/monads";

export class PipoRiskyLoop<T, A extends Array<T>> {
    private value: A;

    constructor(value: A) {
        this.value = value;
    }

    public static enter<T, A extends Array<T> = Array<T>>(value: A) {
        return new PipoRiskyLoop<T, A>(value);
    }

    public forEach<E>(fn: (val: T) => Result<unknown, E>): Result<A, E> {
        for (const valueElement of this.value) {
            const res = fn(valueElement);
            if(res.isErr()) {return res;}
        }

        return Ok(this.value);
    }

    public exit(): A {return this.value;}
}
