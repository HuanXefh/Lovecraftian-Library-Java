# Lovec Class

**Class** in Lovec is essentially a constructor function. You can define a new class quickly with `newClass()` and `initClass()`:

```js
// Define a class
// `initClass()` is required to complete the class definition
const SomeClass = newClass().initClass();


// Define `init` method of its prototype
// Without this method you cannot create instance of this class!
SomeClass.prototype.init = function(someProp) {
  // Initialize instance properties here
  this.someProp = someProp != null ? someProp : "ohno";
};


// Define a class method
// `this` here is the class
SomeClass.someFun = function() {
  print("ohyes");
};


// Define an instance method
// `this` here is the instance
SomeClass.prototype.someFun = function() {
  print(this.someProp);
};




SomeClass.someFun();                // Prints "ohyes"
new SomeClass().someFun();                // Prints "ohno"
new SomeClass("ohyes").someFun();                // Prints "ohyes"
```

Additionally, all instances of a Lovec class have `getClass()`, which returns the Lovec class used. The keyword `instanceof` also works normally on Lovec classes.

A Lovec class can extend another class and implement interfaces, just like normal classes:

```js
// You need an object to define an interface
// `__PROTO__` object inside is used for instance methods
const SomeInterface = new CLS_interface({
  oof() {
    print("class oof");
  },

  __PROTO__: {
    oof() {
      print("instance oof");
    },
  },
});


// Define a class with `SomeClass` as the super class
// `SomeInterface` is implemented for this class
const OtherClass = newClass().extendClass(SomeClass).implement(SomeInterface).initClass();


// Override the instance method `someFun`
OtherClass.prototype.someFun = function(someProp) {
  // If no argument provided, call the super method from `SomeClass`
  if(someProp == null) {
    this.super("someFun");
    return;
  };

  print(someProp);
};


OtherClass.someFun();                // Prints "ohyes", inherited method
new OtherClass().someFun();                // Prints "ohno", super method is called
new OtherClass().someFun("not ohno");                // Prints "not onno", super method is NOT called
OtherClass.oof();                // Prints "class oof", implemented method
new OtherClass().oof();                // Prints "instance oof", implemented method
```

`super()` method is a special method in Lovec classes and their instances. The first argument is a string of method name, the rest arguments are passed down to the super method. You can call `this.super(funName, ...args)` in either class methods or instance methods.

You can call `extendClass()` only once, since only one super class is allowed for a Lovec class. However, you can implement infinite amount of interfaces by `implement()` chaining. There is also an alias method `extend()` for `extendClass()`.

You can get super class of a Lovec class with `getSuper()`. If the class has no super class, `Function` will be returned.

You can't set properties with interfaces. The object used for `CLS_interface` must contain functions only (except `__PROTO__`), otherwise an error will be thrown.
