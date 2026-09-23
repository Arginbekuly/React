function createTask(taskName){
    let counter = 0;

    return {
        getCount(){
            return counter;
        },

        getName(){
            return taskName;
        },

        reset(){
            return  counter = 0;
        },

        run(){
            counter++;
            const randomTime = Math.floor(Math.random() * 1500) + 500;

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const isSuccess = Math.random() > 0.5;

                    if (isSuccess) {
                        resolve({status: 'Completed', counter : counter ,time: randomTime });
                    }

                    else{
                        reject({status: 'Failed', counter : counter ,time: randomTime});
                    }
                },randomTime);
            });
        }

    }
}

const taskUsers = createTask("Load Users");
const taskPosts = createTask("Load Posts");
const taskComments = createTask("Load Comments");

function updateUI(taskKey, result) {
    document.getElementById(`status-${taskKey}`).textContent = result.status;
    document.getElementById(`count-${taskKey}`).textContent = result.counter;
    document.getElementById(`time-${taskKey}`).textContent = result.time;

    const card = document.getElementById(`card-${taskKey}`);
    if (result.status === "Completed") {
        card.className = "task-card completed";
    } else {
        card.className = "task-card failed";
    }
}

document.getElementById("btn-users").addEventListener("click", () => {
    taskUsers.run()
        .then(res => updateUI("users", res))
        .catch(err => updateUI("users", err));
});

document.getElementById("btn-posts").addEventListener("click", () => {
    taskPosts.run()
        .then(res => updateUI("posts", res))
        .catch(err => updateUI("posts", err));
});

document.getElementById("btn-comments").addEventListener("click", () => {
    taskComments.run()
        .then(res => updateUI("comments", res))
        .catch(err => updateUI("comments", err));
});


document.getElementById("btn-run-all").addEventListener("click", async () => {
    const outputText = document.getElementById(`output-text`);
    if (outputText) {
        outputText.innerHTML = "Execute all tasks...";
    }

    await Promise.allSettled([
        taskUsers.run().then(res => updateUI("users", res)).catch(err => updateUI("users", err)),
        taskPosts.run().then(res => updateUI("posts", res)).catch(err => updateUI("posts", err)),
        taskComments.run().then(res => updateUI("comments", res)).catch(err => updateUI("comments", err))
    ]);

    if (outputText) {
        outputText.innerHTML = "<strong>All tasks finished!</strong>";
    }
})

document.getElementById("btn-compare").addEventListener("click", async () => {
    const outputText = document.getElementById(`output-text`);
    if (outputText) {
        outputText.innerHTML = "Comparing tasks...";
    }
    const startSeq = performance.now()
    try { await taskUsers.run(); } catch(err) {}
    try { await taskPosts.run(); } catch(err) {}
    try { await taskComments.run(); } catch(err) {}
    const endSeq = performance.now()
    const seqTime = (endSeq - startSeq).toFixed(2);

    const startPar = performance.now()
    await Promise.allSettled([
        taskUsers.run(),
        taskPosts.run(),
        taskComments.run(),
    ]);
    const endPar = performance.now()
    const parTime = (endPar - startPar).toFixed(2);
    if (outputText) {
        outputText.innerHTML = `
            <p><strong>Последовательное выполнение (Sequential):</strong> ${seqTime} ms</p>
            <p><strong>Параллельное выполнение (Parallel):</strong> ${parTime} ms</p>
            <hr>
            <p><em>Параллельное выполнение быстрее, так как таймеры стартуют одновременно в Web API!</em></p>
        `;
    }
})

document.getElementById("btn-event-loop").addEventListener("click", () => {
    console.clear();
    console.log("=== START EVENT LOOP DEMO ===");

    console.log("1: Synchronous code (Call Stack)");

    setTimeout(() => {
        console.log("4: setTimeout callback (Macrotask)");
    }, 0);

    Promise.resolve().then(() => {
        console.log("3: Promise .then() callback (Microtask)");
    });

    console.log("2: Synchronous code end (Call Stack)");

    const outputText = document.getElementById("output-text");
    if (outputText) {
        outputText.innerHTML = "Демо запущено! <strong>Откройте консоль браузера (F12)</strong>, чтобы увидеть реальный порядок выполнения Event Loop.";
    }
});

document.getElementById("btn-reset").addEventListener("click", () => {
    taskUsers.reset();
    taskComments.reset();
    taskPosts.reset();

    document.getElementById("count-users").textContent = "0";
    document.getElementById("count-posts").textContent = "0";
    document.getElementById("count-comments").textContent = "0";

    document.getElementById("status-users").textContent = "Not started";
    document.getElementById("status-posts").textContent = "Not started";
    document.getElementById("status-comments").textContent = "Not started";

    document.getElementById("time-users").textContent = "-";
    document.getElementById("time-posts").textContent = "-";
    document.getElementById("time-comments").textContent = "-";


    const outputText = document.getElementById("output-text");
    if (outputText) {
        outputText.innerHTML = "Все счётчики сброшены!";
    }
})

