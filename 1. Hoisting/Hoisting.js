/**
 * HOISTING
 * It lets us to use variables / functions / class before it was declared.
 */


console.log("Value of x: ", x); // Undifined

var x = 10;

/**
 * The above code logs UNDIFINED for x value.
 * Why ?
 * A Global Execution Context is created when the code runs
 * -> It ihas 2 phases 
 *      1. Memory Phase
 *      2. Code / Thread Phase
 * JS -> traverse the code and loads all the variables into memory phase.
 * So in memory phase `var x` is created, the value of this x will be undefined
 * Code Phase -> Execute line by line
 * We are log line at that time x value is undefined.
 * Next x value becomes 10.
 * After this the Global Execution Context will be deleted.
 */


// ---------------------------------------------------------------------------------------------------------

X = 30;

console.log("Value of X: ", X); // 30

var X = 10;

// ---------------------------------------------------------------------------------------------------------


var globalVar = 10;

globalFunc()

function globalFunc() {
    var localVar = 1;
    console.log("Inside Global Func");
}

/**
 * For Functions
 * Memory Phase - entire function is created along with body, not just `globalFunc`
 * Code Phase - inside this a Local Execution Context will be created for that function, and that also have
 *              memory and code phase.
 * So even if we call the function before its declaration, it will be executed.
 */


// globalFunc1() // Throws Error.

var globalFunc1 = function() {
    console.log("Inside Global Func1");
}

/**
 * But here since `globalFunc1` is a variable, as discussed it will be undefined at first.
 */


// ---------------------------------------------------------------------------------------------------------

y = 10; // we get ReferenceError: Cannot access 'y' before initialization

console.error("Value of Y: ", y);

let y = 20;

/**
 * So 'let' and 'const' dont hoist? - No, they hoist, but...
 * We get error because of TDZ - Temporal Dead Zone.
 * The Temporal Dead Zone (TDZ) in JavaScript is the period between when a variable is CREATED in memory and when it is INITIALIZED with a value. During this period, accessing the variable results in a ReferenceError.
 * A variable declared with let , const , or class is said to be in a "temporal dead zone" (TDZ) from the start of the block until code execution reaches the place where the variable is declared and initialized
 * The TDZ only applies to variables declared with let and const
 */