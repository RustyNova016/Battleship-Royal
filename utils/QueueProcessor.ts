/** Process a queue of functions */

export class QueueProcessor {
    private eventQueue: (() => void)[] = [];
    private processingQueue = false;

    public addToQueue(fn: () => void) {
        this.eventQueue.push(fn);

        if (!this.processingQueue) {
            this.processingQueue = true;
            this.process();
        }
    }

    public process() {
        while (this.eventQueue.length > 0) {
            const fn = this.eventQueue.shift();
            if (fn === undefined) {continue;}

            fn();
        }

        this.processingQueue = false;
    }
}