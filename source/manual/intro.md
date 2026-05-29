# Introduction to Symbolic FORTH

+ Oh, FORTH is a stack-oriented programming language, or more correctly, family of programming languages. The inventor of the original FORTH, and promulgator of many FORTHs since, is Charles "Chuck" Moore. 

+ There are some great FORTH histories out there, so I'll skip that bit here.

+ What is important to note are some attributes of FORTH in general, early and "hard core, low level" FORTH systems, and how Symbolic FORTH differes from ... well, all of them!

## What is FORTH?

FORTH is, as stated above, a stack-oriented programming language. Early FORTHs are very simple, having only integer, a parameter stack, a return stack, and bunch of "words", very like functions, which provide the ability to manipulate the stack, calculate with numbers, mess with memory, create more words, and print stuff.

Such FORTHs are very small, very fast, fairly simple, and often operate directly on hardware, with no operating system. They are often used to control hardware devices or to be the low level boot language for computers.

A FORTH is an editor, interpreter, and compiler. The editor typically mixes input and output - the human types in input including the program, and the program prints on the same area of the screen after the programmer's input.

The FORTH interpreter works word, or token, by word. It usually works somewhat like this:

@numbered-list

1. the user inputs text

2. the interpreter reads one word - continuous characters until a whitespace is met; we call this a "token"

3. the interpeter determines if this token is an integer, if so it converts it to a proper integer, and puts it on the stack

4. if the token is a "word", a function, it will execute the word

5. then the interpreter goes back to (2), repeating the process until the program input ends, in which case it returns to step (1) to await further input, or exits, depending upon it's design and purpose.

@end



Okay, it is of course a bit more complicated than that, but that is the mental model of how the FORTH system runs a program.

So what does a FORTH program do?

As we stated before, a FORTH program primitively can perform math operations on numbers, can manipulate the stack by pushing values onto it or popping them off, can use conditional and looping logic, and can perform basic ouput to the console. On top of this basic machine, which can indeed do much, a FORTH is of course programmed to do "something". Since that something is traditionally control hardware of some sort, most FORTHs are customized with special words to perform operations with machinery, such as receive input from sensors, control motors, and so forth.

In fact, the original FORTH was created to control a telescope in an observatory.

> put some links to brilliant FORTH articles, perhaps we should download them and keep them in this repo?

## Symbolic FORTH

Symbolic FORTH differs from low level machine FORTHs in significat ways.

For one, it is far from the machine. Rather than run directly on hardware as the bad-ass FORTHs do, it runs in the browser or any Javascript runtime. Yes, Symbolic FORTH is implemented in Javascript. Sad, I know.

Symbolic FORTH is, as of this writing, an educational project. Because of my experience with Javascript, it is relatively within my powers to create and maintain it. Sure, I'd love the challenge of working with raw memory, registers, io addresses, and such, but that is not this.

Being based on Javascript, the "hardware" we have access to is the browser DOM, if we are running on the browser. On the console, we can run in node or any other javascript - we don't use anything spectacularly weird, just a modernish Javascript is enough.

Our forth does not use addresses at all. We recognize the type of a value, which  FORTH does not typically do. We support JS number, string, boolean, dates, arrays, and maps. Other types can be supported as well.

We use some more verbose words for the equivalent functionalty to traditional FORTH. This is because we have lots of memory, storage space, and screen real estate - early FORTHs did not. Here is an example: In FORTH to print whatever is on the top of the stack to the console, one uses the word <code>.</code>. Yes, you saw that correctly, a single period, or "dot" as we say in FORTH. Of course we support that in Symbolic FORTH, but we refer <code>PRINT</code>.

I won't bore you with all the small differences and nuances, there is plenty of time for that later.

One more worthy mention, though, is the "symbol" after which this FORTH is named. I chose that name primarily because I want to be able to use symbolic names for case in which one might use an address or word. A symbol us just a short string with no spaces, and is indicated like <code>~hi_im_a_symbol<code> or <code>SYM me_TOO!</code>. The tilde "~" prefix indicates the following token is a symbol, and the word "SYM" reads the following symbol and treats it as a symbol. In both cases, the symbol is created and placed on the top of the stack.

I also like "Symbol" because I have a background in common lisp, and fell in love with the idea of text labels for all sorts of things

Finally, it is a bit of tongue-in-cheek, as I consider this a FORTH in name and spirity, symbolizing FORTH's logical approach, but not actually implemented as one.
