const { sleep } = require('./timers')

class Semaphore {
    constructor(rooms = 1) {
        this.rooms = Math.max(rooms, 1)
        this.count = 0

        this.increase = this.increase.bind(this)
        this.decrease = this.decrease.bind(this)

        this.release = this.release.bind(this)
    }

    increase() {
        this.count++
    }

    decrease() {
        this.count--
    }

    release(promise) {
        if (promise) {
            promise.finally(this.decrease)
        }
        else {
            this.decrease()
        }
    }

    async acquire() {
        while (this.count >= this.rooms) {
            await sleep(1)
        }

        this.increase()

        return this.release
    }

    async join() {
        while (this.count !== 0) {
            await sleep(1)
        }
    }
}

module.exports = { Semaphore }