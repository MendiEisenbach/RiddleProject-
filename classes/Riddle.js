class Riddle
{
    constructor(id, name, taskDescription, correctAnswer)
    {
        this.id = id;
        this.name = name;
        this.taskDescription = taskDescription;
        this.correctAnswer = correctAnswer;
     }

    ask(prompt)
    {
    console.log(this.taskDescription);
    let Answer = ""
    while(Answer != this.correctAnswer)
    {
        Answer = prompt("Please type your answer:")
    }
    console.log("Correct answer.")
    }
}

export default Riddle;