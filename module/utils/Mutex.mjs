
export class Mutex {
    #mutex = Promise.resolve();

    #lock() {
        let begin = unlock => {}

        this.#mutex = this.#mutex.then(() => {
            return new Promise(begin);
        })

        return new Promise(res => {
            begin = res;
        })
    }

    async dispatch(func){
        const unlock = await this.#lock();
        try {
            return await Promise.resolve(func());
        } finally {
            unlock();
        }
    }
}