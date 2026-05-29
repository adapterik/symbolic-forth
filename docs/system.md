# System

A FORTH is like a living, breathing system. It is an interpreter, a compiler, a runtime, and in some cases an operating system.

A description of a FORTH system tends to be quite mechanical, expressing the system in terms of registers, memory addresses, memory blocks, and so forth. In our case, we are developing on top of a web browser utilizing the built-in Javascript interpreter, the DOM API and potentially other APIs. 

As such, the "raw material" for this FORTH consists of functions, strings, primitive types (boolean, null, number), and simple structures like Array and Object. 

One implication is that we do not focus too much on implementation of low level operations like the queues, dictionary, strings, and so forth. These are all expressed in Javascript anyway, so the details are not very interesting.

However, many of the "features" of a hardware level FORTH sort of fall away in this context.

For example, the manner in which the interpreter works, words are executed (or not), are typically highly detailed since they must be designed from scratch.

## Runtime

The system runtime consists of:

- an interpreter
- data structures:
    - a data stack
    - a return stack
    - an object database
    - a word dictionary
- text input and output
    - an ouput for program feedback 
    - a console for system output
    - a function to feed program text into the system
- a function to start the interpreter

As a principle, the "core" FORTH consists of those features and associated words which implement the above elements.

This implies, for instance that textual output for programs (output) and the system (console) is built in. By contrast, the functionality to draw on a canvas, and to compose HTML, is provided by packages of additional words and variables. These packages are called "vocabularies", although we might as well use "module" or "package" or "namespace". But we stick with the forthy words which carry the "word" metaphor.

The basic lifetime is:

- start system
- create and initialize all data structures
- provide code to the system
- run the code

In order to create a REPL, one would do something like this:

- start system
- create and init data 
- loop until quit:
    - provide code to system
    - run code
    
In the web tool provided with Symbolic FORTH, there is no traditional REPL. Rather, a forth instance is created and populated within the page's javascript environment. A DOM event handler implemented in Javascript responds to the submission of text from a form input area. The text from this form event is provided to the FORTH system instance, and then the run method called. Thus, in a sense, the Javascript event system forms the Loop in the REPL.

## Interpreter


