# IDEAS

So here is an idea ...

... that is what this document is all about.

---

## Fixed vs growable 

One of the great attributes of most FORTHs is that they are suitable for constrained environments. They do well with few resources, such as RAM or disk space, and of course are thrifty with CPU.

But in today's problems we are often faced with an amount of data which requires  an unknown amount of especially disk and memory capacity. It may be small, medium, or large, and the time we have to solve a problem is limited and we won't necessarily have time to construct a thrifty, efficient solution.

At these times we need to program in a style in which structures grow, and we don't want to bump up against resource constraints all the time.

But at other times we do. And generally we, or at least I, do want to live within certain bounds. Both practically, because we don't want to slow down our machine, or we want to be able to keep using our older machines for a long time, or ethically, because it is a good practice, and living light on this earth is what we should all strive for. It requires effort, and that is good.

So the challenge is to design some features of the language to work in both ways. It could be a global switch which every word and feature honors, or it could be different versions of words.

Good candidates include:

- string: use a string cache or not? Currently all words are stored in a single array and only the id is stored. However, we could also keep the string literal in the stack.

- strucutres like arrays, maps, sets, stacks, queues can be limited in size, or left to grow indefinitely. 


Perhaps we could utilize vocabularies for this. One vocabulary for fixed, one for dynamic, and perhaps others for other approaches. This lets us simply expand or change the system over time, and only use the vocabularies we wish to for any given project!



## Symbols vs "Syntax" 

A very FORTHy thing is to use parsing words to form a type of syntax. The colon-word itself, the canonical word of words, is the prime example. 

But many smaller cases too, like VAR, CONST, and others in which the thing to be created is not yet named, so the name is parsed from the program stream.

But this is "Symbolic FORTH" and perhaps we should just go for it. 

We can write `10 ~foo VAR` rather than `10 VAR foo`. And then `~foo @` or `10 ~foo !`.

Of course we still need parsing words, for colon, conditionals, loops, and any situation in which we need to form a word list. But perhaps we can restrict parsing to such things?

## Literals

Oh, but literals are very nice too, and they are necessarily parsing words.

Without recognizers, we can always use simple parsing words, and that is probably just fine. It is less concise, but simpler and more uniform.

Perhaps we should be judicious with recognizers. We currently have no language constructs for building recognizers (or parsing words for that matter.) They must be constructed in the implementation language, still Javascript.

But literals have their place, too. Let's look at some alternatives

`~foo` vs `SYM foo`
`1234` vs `NUM 1234`
`" bar"` vs `"bar"`
`{foo: "bar", baz: "fuzz"}` vs ?? perhaps `# SYM foo " bar" SYM baz " fuzz MAP::CREATE`


## Implementation Language

It would be nice to have a C backend at some point... But we currently rely upon  the dynamic nature of Javascript.

## Order

Sometimes FORTH program streams are read left to right, and sometimes right to left. That is one of the confusing aspects of it. I wonder if there is some way to make this more uniform?

The canonical exmaple is math operations. Even though we write `4 2 /` which means `4/2`, in the implemntation of `/` in which we take the 2 first, and the 4 second, we know that the 4 is actually first and the 2 second. Okay, this is fine so far, I guess, because the conflict is restricted to implementation. But I think the idea is more pernicious, since the language details are so close to the user - that is the language designer and user are closer than in most programming languages. So the question inevevitably arises, especially for unfamiliar words - are the stack arguments used in FORTH order as they appear on the stack, or in syntactical order as they appear typed or written.


# Compiling vs Runtime

Stuff to the left of a word form possible arguments to it at runtime, stuff to the right possible arguments, or information, at compile time.

A couple of considerations. If it were important, say pre-compiling code run many times, more compile time work means faster run time.

To make this more palatable, we need to really incorporate this as a very legitimate and normal way of operating. In SF, it is easy, at least in core words writtin in JS, to do compile time stuff.

Another consideration is whether we need compile-time or run-time context. So far our SF does compiling right before execution in a typical context, say the main body of the program.

E.g. an array is defined via compilation, but then the compiled word list is executed right afterwards, so it gets the context.

But array elements could be pre-defined as an anoymous word list - though the word list, like a word definition, would be achieved via compilation anyway, so does it really make a difference?

