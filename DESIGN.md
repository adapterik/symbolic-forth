# Design of WForth

WForth is a FORTH programming language implementation written in Javascript and designed to run in a web browser.

It includes an API for running programs, and an IDE for development.

## Differences from standard FORTH

I've attempted to make WForth adhere to the general conventions of how a FORTH should operate, relying upon the general advice of Chuck Moore's "A Problem Oriented Language", ignoring the standard, and inspired by the various flavors of FORTH (including Chuck's work!) to allow for adjustment to the specific runtime environment.

## Goals

- Explore the design of a FORTH system
- Explore the adaptations needed for FORTH to run in a browser, and solve browser-application problems
- Be a compact, dynamic, embeddable alternative to Javascript in the browser

## Roadmap

I do plan on porting the entire thing to WebAssembly. Then perhaps there will be two WForths - the Javascript variant which will be easier to hack on for most people, and the WebAssembly version which should (may?) have better performance.

Generally the Javascript version relies heavily on Javascript implementations of core words and many application words as well. Just because it is easy to do so, and will perform better (we should measure this!). Thus it should be easier for those familiar with JS to develop.

The WA version will be more "hard core", using WA to implement just core FORTH words, enough to bootstrap FORTH, with most basic FORTH and application forth being implemented in FORTH. Some words will require WA + Javascript, but we may also be able to create some core FORTH words to deal with this.

## Design

Well, finally to the design!

As stated above, this FORTH will attempt to address the design goals of Chuck Moore's seminal book "A Problem Oriented Language".

This book was written in the era of card stacks and terminals. He also has a strong focus on hardware interfacing and often running on bare metal.

Still, the interesection between his design goals and how this can be applied to the js & web browser environment is quite strong.

So let us begin.

### The System

The WForth system is composed of an interpreter, compiler, program runner, and IDE. Whole program, or problem pieces, are fed into WForth, which compiles the code on the fly, and then runs the compiled code. How this works specifically is up to the developer. However, proper usage does involve certain steps in order for it to behave as you might expect.

First let me describe the basic components of the WForth system. This will make discussions about how it works much easier to understand.

LEFT OFF HERE

This is due to the compilation process. The compiler takes the code, which is a string, and inspects each word - a string delimited by at least one space. The word can be interpreted in numerous ways, depending on the state of the FORTH system. By "state", I mean the composition of various bits of the FORTH runtime, primarily the dictionary. If a word matches an executable word in the dictionary, it is compiled to an execu
