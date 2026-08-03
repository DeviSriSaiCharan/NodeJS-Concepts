

const obj1 = {
    fname: 'Charan',
    lname: 'Neelapu',
    getFullName: function() {
        return `${this.fname} ${this.lname}`;
    }
}


console.log(obj1);
console.log(obj1.getFullName());

// OUTPUT:
// {
//   fname: 'Charan',
//   lname: 'Neelapu',
//   getFullName: [Function: getFullName]
// }
// Charan Neelapu


/**
 * Lets say i want to create another object with same properties and methods as obj1.
 * But with different values for fname and lname.
 * 
 * There is no inheritance in JS. So we need to copy paste the properties and methods from obj1 to obj2.
 * But this violates the DRY principle. So we need to find a way to inherit the properties and methods from obj1 to obj2.
 * 
 * We can do this by using `Object.create()` method. This method creates a new object with the specified prototype object and properties.
 */

// const obj2 = {
//     fname: 'John',
//     lname: 'Doe',
//     getFullName: function() {
//         return `${this.fname} ${this.lname}`;
//     }
// }

const obj2 = Object.create(obj1);

console.log(obj2);
console.log(obj2.getFullName());

// OUTPUT:
// {}
// Charan Neelapu

/**
 * If we observe the ouput, it is an empty object.
 * But when we call the getFullName() method, it is returning the full name of obj1.
 * 
 * But How?
 * 
 * In JS objects we have a hidden property called `__proto__: {}`.
 * When we every we do obj2.<property_name>, JS will first check if the property exists in obj2. If it does not exist, it will check the `__proto__` property of obj2. If it exists, it will check if the property exists in the `__proto__` object. If it does not exist, it will check the `__proto__` property of the `__proto__` object and so on until it reaches the end of the prototype chain.
 * If not found, then give error
 * 
 * 
 * When we do obj2 = Object.create(obj1), what it does is
 * obj2 = { __proto__: obj1 }
 */

obj2.__proto__.fname = 'Sai Charan';

console.log(obj1.getFullName());
// Sai Charan Neelapu



class Person {
    constructor(fname, lname) {
        this.fname = fname;
        this.lname = lname;
    }

    getFullName() {
        return `${this.fname} ${this.lname}`;
    }
}

/**
 * In JS for every class, it creates a prototype object. This prototype object is shared among all the instances of the class.
 */

const  p1 = new Person('Charan', 'Neelapu');

/**
 * What it does is, it makes p1.__proto__ = Person.prototype
 */
