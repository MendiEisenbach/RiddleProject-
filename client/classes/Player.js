class Player {
    constructor(name, times = []) {
        this.name = name;
        this.times = times;
    }

    recordTime(start, end) {
        let DurationSolution = end - start;
        this.times.push(DurationSolution);
    }

    showStats() {
        let counter = 0;
        for (let i = 0; i < this.times.length; i++) {
            counter += this.times[i]
        }
        console.log(`The total time you spent answering the questions is: ${counter / 1000}`)
        console.log(`The average time it took you to solve each question is: ${(counter / this.times.length) / 1000}`)
    }

    getTotalTimeInSeconds() {
    let counter = 0;
    for (let i = 0; i < this.times.length; i++) {
        counter += this.times[i];
    }
    return Math.floor(counter / 1000);
}

}

export default Player;



