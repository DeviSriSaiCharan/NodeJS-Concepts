const fs = require("fs");
const crypto = require("crypto");

/**
 * Node.js Internal Workings
 *
 * When we run a Node.js program, Node creates a process to execute our code.
 * JavaScript code runs on a single main thread, while Node.js uses the operating
 * system and libuv to handle asynchronous operations like file I/O, networking,
 * and some CPU-intensive tasks in the background.
 *
 * Execution Flow:
 * 1. Start the Node.js process.
 * 2. Execute all the top-level code (code that is not inside any function or callback).
 * 3. While executing the top-level code:
 *    - Load modules whenever require() is encountered.
 *    - Register callbacks for asynchronous operations like setTimeout(),
 *      setImmediate(), file reads, network requests, etc.
 * 4. Once the synchronous code finishes, the Event Loop starts and begins
 *    executing the registered callbacks whenever they are ready.
 *
 * Event Loop Phases:
 * 1. Timers          - Executes callbacks whose timers have expired
 *                      (e.g., setTimeout(), setInterval()).
 * 2. Pending Callbacks - Executes some system-level callbacks that were deferred.
 *                        (This phase is mostly handled internally by Node.js.)
 * 3. Poll            - Retrieves new I/O events and executes I/O callbacks.
 *                      If there are no pending I/O operations, Node decides
 *                      whether to wait for new events or move to the next phase.
 * 4. Check           - Executes all setImmediate() callbacks.
 * 5. Close Callbacks - Executes callbacks for closed resources like sockets.
 */

// console.log("Start");

// setTimeout(() => console.log("Inside Timeout"), 0);

// setImmediate(() => console.log("Inside Immediate"));

// console.log("End");

/**
 * First, the top-level code is executed synchronously.
 * So "Start" and "End" are printed immediately.
 *
 * After all the synchronous code finishes, the Event Loop starts.
 * Both setTimeout() and setImmediate() have already been registered,
 * so the Event Loop executes them when their respective phases are reached.
 *
 * Since both were scheduled from the top-level code, Node.js does not
 * guarantee which one will execute first. On many systems,
 * setTimeout(..., 0) runs before setImmediate(), but on some systems
 * the order may be reversed.
 *
 * Therefore, the output can be either:
 *
 * Start
 * End
 * Inside Timeout
 * Inside Immediate
 *
 * OR
 *
 * Start
 * End
 * Inside Immediate
 * Inside Timeout
 *
 * If both callbacks are scheduled inside an I/O operation (like fs.readFile()),
 * then setImmediate() is guaranteed to execute before setTimeout(..., 0).
 */

/**
 * Learnings/NodeJS/2. Architecture on 󰊢 main [?] ❯ node Architecture.js
    Start
    End
    Inside Immediate
    Inside Timeout

    But when i run this online compiler, timeout is executed before immediate.
 */


// fs.readFile(__filename, "utf-8", (err, data) => {
//     setTimeout(() => console.log("Inside Timeout after I/O"), 0);
//     setImmediate(() => console.log("Inside Immediate after I/O"));
// });

/**
 * Why does setImmediate() execute before setTimeout() inside an I/O callback?
 *
 * The callback passed to fs.readFile() is executed during the Poll phase
 * of the Event Loop.
 *
 * After the Poll phase finishes, the Event Loop immediately moves to the
 * Check phase, where all setImmediate() callbacks are executed.
 *
 * Only after completing the Check phase does the Event Loop start the next
 * iteration, where it reaches the Timers phase and executes any expired
 * setTimeout() callbacks.
 *
 * Because of this order of phases:
 *
 * Poll (I/O callback)
 *      ↓
 * Check (setImmediate)
 *      ↓
 * Next Iteration
 *      ↓
 * Timers (setTimeout)
 *
 * Therefore, when both are scheduled inside an I/O callback,
 * setImmediate() is guaranteed to execute before setTimeout(..., 0).
 */



// CPU Intensive Task Example

/**
 * CPU Intensive tasks, like hashing are not handled by the Event Loop directly.
 * Instead, Node.js offloads these tasks to the libuv thread pool, which runs in the background.
 * By default, it has 4 threads
 * Max Threads can be set using UV_THREADPOOL_SIZE environment variable
 */

// const start = Date.now();

// crypto.pbkdf2("password1", "salt1", 100000, 512, "sha512", () => {
//     console.log(`${Date.now() - start} ms - Password1 hashed`);
// });

// crypto.pbkdf2("password2", "salt2", 100000, 512, "sha512", () => {
//     console.log(`${Date.now() - start} ms - Password2 hashed`);
// });

// crypto.pbkdf2("password3", "salt3", 100000, 512, "sha512", () => {
//     console.log(`${Date.now() - start} ms - Password3 hashed`);
// });

// crypto.pbkdf2("password4", "salt4", 100000, 512, "sha512", () => {
//     console.log(`${Date.now() - start} ms - Password4 hashed`);
// });

// crypto.pbkdf2("password5", "salt5", 100000, 512, "sha512", () => {
//     console.log(`${Date.now() - start} ms - Password5 hashed`);
// });

// crypto.pbkdf2("password6", "salt6", 100000, 512, "sha512", () => {
//     console.log(`${Date.now() - start} ms - Password6 hashed`);
// });

/**
 * OUTPUT:
    324 ms - Password1 hashed
    326 ms - Password4 hashed
    327 ms - Password2 hashed
    331 ms - Password3 hashed
    625 ms - Password5 hashed
    625 ms - Password6 hashed 
 * If you observe the first 4 hashes are completed in ~300ms, while the last 2 take ~600ms.
 * This is because the default libuv thread pool has 4 threads, so the first 4 hashing tasks
 * are executed in parallel, while the last 2 have to wait for a thread to become available.
 */

// Increase the thread pool size to 6 and run the same code again:

process.env.UV_THREADPOOL_SIZE = 6;

const start1 = Date.now();

crypto.pbkdf2("password1", "salt1", 100000, 512, "sha512", () => {
    console.log(`${Date.now() - start1} ms - Password1 hashed`);
});

crypto.pbkdf2("password2", "salt2", 100000, 512, "sha512", () => {
    console.log(`${Date.now() - start1} ms - Password2 hashed`);
});

crypto.pbkdf2("password3", "salt3", 100000, 512, "sha512", () => {
    console.log(`${Date.now() - start1} ms - Password3 hashed`);
});

crypto.pbkdf2("password4", "salt4", 100000, 512, "sha512", () => {
    console.log(`${Date.now() - start1} ms - Password4 hashed`);
});

crypto.pbkdf2("password5", "salt5", 100000, 512, "sha512", () => {
    console.log(`${Date.now() - start1} ms - Password5 hashed`);
});

crypto.pbkdf2("password6", "salt6", 100000, 512, "sha512", () => {
    console.log(`${Date.now() - start1} ms - Password6 hashed`);
});

process.env.UV_THREADPOOL_SIZE = 4; // Resetting back to default

// 326 ms - Password1 hashed
// 328 ms - Password3 hashed
// 328 ms - Password2 hashed
// 330 ms - Password6 hashed
// 436 ms - Password4 hashed
// 437 ms - Password5 hashed






/**
 * Node.js Internal Workings — Microtasks
 *
 * We already know: top-level code runs first, then the Event Loop starts
 * cycling through its phases (Timers -> Pending Callbacks -> Poll -> Check -> Close).
 *
 * What we MISSED is that there's a queue that runs BETWEEN all of that —
 * the Microtask Queue. It isn't a "phase" of the event loop at all. It's a
 * checkpoint that Node (via V8) drains:
 *
 *   1. After the top-level script finishes executing.
 *   2. After EVERY single callback finishes — not just once per phase,
 *      but after each individual timer callback, each I/O callback,
 *      each setImmediate callback, etc.
 *
 * So the mental model is:
 *
 *   run one callback -> drain ALL microtasks -> run next callback -> drain ALL microtasks -> ...
 *
 * What counts as a "microtask"?
 *   - Promise.then() / .catch() / .finally() callbacks
 *   - queueMicrotask(fn)
 *   - process.nextTick(fn)  (Node-specific, and it's actually a SEPARATE,
 *     higher-priority queue — more on this below)
 *
 * What counts as a "macrotask" (i.e. a normal Event Loop task)?
 *   - setTimeout() / setInterval()
 *   - setImmediate()
 *   - I/O callbacks (fs, network, etc.)
 */


// ============================================================
// Example 1: Microtasks always run before the next macrotask
// ============================================================

// console.log("start");

// setTimeout(() => console.log("timeout"), 0);

// Promise.resolve().then(() => console.log("promise"));

// console.log("end");

/**
 * OUTPUT:
 *   start
 *   end
 *   promise
 *   timeout
 *
 * WHY:
 * "start" and "end" run synchronously as part of top-level code.
 * setTimeout schedules a MACROtask (goes into the Timers phase queue).
 * Promise.then schedules a MICROtask.
 *
 * Once the top-level script finishes ("end" is printed), Node drains the
 * microtask queue FIRST -> "promise" prints.
 * Only THEN does the Event Loop move to the Timers phase -> "timeout" prints.
 *
 * Microtasks always cut the line in front of macrotasks.
 */


// ============================================================
// Example 2: process.nextTick() vs Promise microtasks
// ============================================================

// console.log("start");

// process.nextTick(() => console.log("nextTick"));

// Promise.resolve().then(() => console.log("promise"));

// console.log("end");

/**
 * OUTPUT:
 *   start
 *   end
 *   nextTick
 *   promise
 *
 * WHY:
 * process.nextTick() is NOT technically part of the "microtask queue"
 * (that's a JS/V8 concept, Promises use it). nextTick is a Node.js-only
 * mechanism with its OWN queue, and it has HIGHER priority.
 *
 * The actual draining order after any callback (or top-level script) is:
 *
 *   1. Fully drain the process.nextTick queue.
 *   2. Fully drain the Promise microtask queue.
 *   3. Move on to the next macrotask / event loop phase.
 *
 * Note: "fully drain" means if a nextTick callback schedules ANOTHER
 * nextTick, that new one also runs before Node moves to step 2.
 * This is why recursive process.nextTick() calls can starve the event
 * loop entirely (I/O and timers never get a chance to run).
 */


// ============================================================
// Example 3: Microtasks drain BETWEEN every macrotask, not just once
// ============================================================

// setTimeout(() => {
//     console.log("timeout 1");
//     Promise.resolve().then(() => console.log("promise inside timeout 1"));
// }, 0);

// setTimeout(() => {
//     console.log("timeout 2");
// }, 0);

/**
 * OUTPUT:
 *   timeout 1
 *   promise inside timeout 1
 *   timeout 2
 *
 * WHY:
 * You might expect both timeouts to fire back-to-back since they were
 * both scheduled with a 0ms delay. But after "timeout 1" callback
 * finishes, Node checks the microtask queue BEFORE picking up the next
 * Timers-phase callback. Since a promise was queued inside timeout 1,
 * it resolves immediately, THEN "timeout 2" runs.
 *
 * This proves microtasks are checked after every callback, not just
 * once per event loop phase.
 */


// ============================================================
// Example 4: Same idea, but with I/O (fs.readFile)
// ============================================================

// fs.readFile(__filename, "utf-8", () => {
//     console.log("readFile callback");

//     setTimeout(() => console.log("timeout inside readFile"), 0);
//     setImmediate(() => console.log("immediate inside readFile"));

//     process.nextTick(() => console.log("nextTick inside readFile"));
//     Promise.resolve().then(() => console.log("promise inside readFile"));
// });

/**
 * OUTPUT:
 *   readFile callback
 *   nextTick inside readFile
 *   promise inside readFile
 *   immediate inside readFile
 *   timeout inside readFile
 *
 * WHY:
 * 1. readFile callback runs (Poll phase).
 * 2. Before Node does ANYTHING else, it drains nextTick queue, then
 *    the Promise microtask queue -> "nextTick..." then "promise..."
 * 3. Poll phase has nothing left to do here, so Node moves straight to
 *    the Check phase -> setImmediate fires -> "immediate inside readFile".
 * 4. Only on the NEXT loop iteration does it reach the Timers phase ->
 *    "timeout inside readFile".
 *
 * This matches what we already knew about setImmediate winning inside
 * I/O callbacks — microtasks just squeeze in before that, every time.
 */


// ============================================================
// Example 5: The starvation gotcha (DO NOT run this uncommented for long)
// ============================================================

// let count = 0;
// function starve() {
//     count++;
//     if (count < 5) {
//         console.log("nextTick recursion:", count);
//         process.nextTick(starve);
//     }
// }
// process.nextTick(starve);
// setTimeout(() => console.log("this timeout waits for ALL nextTicks first"), 0);

/**
 * OUTPUT:
 *   nextTick recursion: 1
 *   nextTick recursion: 2
 *   nextTick recursion: 3
 *   nextTick recursion: 4
 *   this timeout waits for ALL nextTicks first
 *
 * WHY:
 * Since the nextTick queue must be FULLY drained (including anything it
 * schedules while draining) before Node moves to the next phase, a
 * process.nextTick() that keeps re-scheduling itself will delay every
 * timer and I/O callback indefinitely. Real production bug pattern:
 * recursive nextTick calls that never let the Timers/Poll phase run.
 * This is also why Promise chains (which use the separate, lower
 * priority microtask queue) are generally safer to recurse in than
 * process.nextTick.
 */


// ============================================================
// Summary — priority order at every checkpoint
// ============================================================

/**
 *   Top-level script OR any single callback finishes
 *              |
 *              v
 *   1. Drain process.nextTick queue completely (including new
 *      nextTicks added during draining)
 *              |
 *              v
 *   2. Drain Promise/queueMicrotask microtask queue completely
 *      (including new microtasks added during draining)
 *              |
 *              v
 *   3. Move to next macrotask (next Timers callback, next Poll
 *      callback, next setImmediate, or next event loop phase)
 *              |
 *              v
 *          repeat forever
 *
 * Rule of thumb: nextTick > Promise microtasks > setTimeout/setInterval
 * (Timers) > I/O (Poll) > setImmediate (Check), and microtasks ALWAYS
 * get fully drained before the event loop is allowed to take its next
 * macrotask step.
 */