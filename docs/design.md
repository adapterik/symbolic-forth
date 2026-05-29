# Design

This is a FORTH, or "FORTH-like", system based on top of Javascript and the Web Browser, as of 2025 browser support.

## FORTH systems

First, to establish bedrock, it is important in this consideration to describe what a "FORTH system" is traditionally defined as.

There are at least two viewpoints for understanding FORTH: as described by it's inventor (or "discoverer"), Charles "Chuck" Moore, and as formalized by the industrial FORTH community. Although structurally similary, the attitude towards what defines a FORTH system is radically divergent.

### Chuck Moore's Vision of FORTH

Chuck Moore invented (or as many say when humans discover a logical pattern and encode it in a computer language or other creative work - "discovered") FORTH in the latest 1960's and early 1970's. In 1970 he wrote a book titled "Programming a Problem-Oriented Language", which he later published free on the web (https://colorforth.github.io/POL.htm), although physical copies may also be obtained.

In this book, he describes the language FORTH (or as he says, the language that would become FORTH), both in broad strokes of design, but also with plenty of his subjective approach to programming.

Consider, for instance, the axioms he has stated as fundamental to his approach:

- Keep It Simple
- Do Not Speculate!
- Do It Yourself!

Isn't it interesting that none of these principles are oriented at computer language design? They are more akin to philosophical approaches to design, to creation, to life. As such, I do not think we have to put on them on the scale with the technical attributes of a computer language - although perhaps as we consider this more, we can.

#### Keep It Simple

The message "Keep It Simple" is probably as appealing today as it was in 1970. The world around us has been becoming more complex and compressed constantly. Much of what we rely upon in daily life is beyond our understanding, being in the domain of large corporations with hordes of engineers, marketers, designers, and support staff. Okay, I'll keep politics and social commentare side out of this (saving that for a future essay). That is appropriate, I think, especially in this case, as Chuck's approach to programming is highly personal.

In fact, he calls his vision of FORTH a "personal programming language".

So what about keeping things simple?

First let us take a step back and recognize that Chuck has created a large number of FORTH systems. Especially earlier in his career, when he worked closely with hardware, his FORTH systems were crafted to exploit each individual system. 

Early FORTHs were almost if exclusively always created to allow direct programming of hardware, as a more friendly and consistent language compared to machine or assembly language. Although that may seem overkill, a testament to the facility of FORTH to adapt to hardware readily is that these systems where built by a single individual. These FORTH systems work directly on hardware, without a separate operating system.

This "ease" (for many FORTH is never "easy") of adaptation to hardware is, I'm sure, enabled by it's very simplicity. So "keeping it simple", is simply how FORTH was allowed to flourish. Make it complex, and it would require a large team to adapt, which may entirely prevent it's existence. Existing languages, more structured and syntatically elaborate languages, would probably be preferred.

Keeping things simple is also very constructive for dealing with FORTH. You see, FORTH is based on relatively flat coding world, consisting of "words" (like functions) executed sequentially. Key to this approach is the abundant use of application-specific words, based on language core words, to capture algorithms, interfaces, and any other manner of capturing the problem at hand. In the end, one has what is today called a "Domain Specific Language" (DSL), which ultimately allows a concise and understandable application.

Of course, we should remember that FORTH was developed when computer memory was measured in Kilobytes, when today it is measured in Gigabytes. As a reminder, that is a scale of a million times more memory available to modern applications, compared to the 1970s. So frugality was a necessity.

#### Do Not Speculate!

The message "Do Not Speculate!" is meant to discourage speculative programming. Chuck has felt that software, and software systems, becomes overly large and complicated because engineers often build in all sorts of accomodations for what they perceive to be future needs. However, Chuck reminds us that:

> The things you might want to do are infinite; that means that each one has 0 probability of realization.


#### Do It Yourself!

Needless to say, Chuck is a very independent-minded person. It may help to understand him by his passions - he loves living away from big cities, and he loves hiking in the wild. In his retirement, he also enjoys cooking.

Regardless of his personality, his advice is oriented at the programmer, and is certainly worth keeping in mind.

He is cautious about large dependencies. Outside code is typically outside one's control. Even in the era of open source, the size of many open source libraries is so large that it is effectively a black box.

If one uses just a small portion of external code, it may be faster in the short term, and create an environment for better maintenance in the future, if one writes the code oneself. It also encourages a deeper understanding of the codebase. Probably more to the point is to put into the context of "Keep It Simple" (and Chuck calls it the "Basic Principle" for good reason): It all likelihood the functionality one needs from an external dependency is a small portion of it. By incorporating a large depency into a program, one immediately increases the footprint of the software, increasing the threat of bugs, security issues, performance, maintenance, training, and so forth.

In the days of agile, scrums, sprints, and all of that, the idea of "doing it yourself", is certainly counter-cultural.

For "serious engineers" this is anathema; for some of us, though, counter-culture is the highest of praise.

As Chuck introduces this topic:

> Now we get down the the nitty-gritty. This is our first clash with the establishment. The conventionsl approach, enforced to a greater or lesser extent, is that you shall use a standard subroutine. I say that you should write your own subroutines. 

## Establishment FORTH

In contrast to Chuck's vision of FORTH, the common (though not exclusive) usa

[ TO BE WRITTEN ]

## Symbolic FORTH

This FORTH is named "Symbolic FORTH" (SymFORTH), and, as alluded to above somewhere, is not a standards-compliant FORTH by any means. Maybe not a true FORTH at all.
 
### Why?

But why "Symbolic"? Because this forth supports a data type called a "symbol". Well, yes, of course I used Common Lisp 20 years ago or so, and the concept of symbols stuck with me. In the context of FORTH, a symbol is an immutable, short string which can be used for many purposes in which a textual identifier is useful. This includes: map keys, named arguments, word names. Symbols have the benefit over strings in that their written form is more compact, they are immutable. They are written like `'a_symbol` - that is, a tick at the beginning. This implies that they are special syntax in this FORTH, which is true. I know this is counter to the normal pattern of FORTH, which far prefers words for everything. 

But why another FORTH at all, and why on top of Javascript, and why in a browser, and why, why, why?

First, I'm enamored with FORTH. I was in the '80s, but had no chance to use it. Now, in retirement from web development and still recovering, it is just pure fun and puzzing. It has certainly been said that creating a FORTH is the best way to understand it. That is unfortunate, but unfortunately may be true. 

Javascript? Well, I know it pretty well, so much easier for me to create a FORTH in than the pure way, in assembly. 

Why in a browser? Partly because I would not use Javascript other than the browser. I know it very well, but don't really like off-browser Javascript programming. I don't quite see what the point is when there are such better languages out there. The browser, though, is a great platform. Implementing on top of it brings the DOM, which is huge. You get HTML and layout, CSS styling, forms, canvas, svg, and lots of other underlying technology, all in one nice package.

Sure, it isn't the minimalism of bare-metal FORTH ... but it does bring FORTH to a new domain, and I'd like to see how well it works there. Front end development is so fraught with huge dependency trees, constant churn, and for bigger projects, the inability to run the development language (TypeScript is the only good language, IMO) directly in the browser, thus losing much of the benefit of such an awesome runtime.

### Features

The features for SymFORTH are:

- built on top of Javascript
- thus runs in the browser
- built-in words for the Document Object Model (DOM) JS API
- more built-in data types than most FORTHs
- a development environment supporting testing, full introspection, running apps, and documentation




## References

- Chuck Moore's ["Programming a Problem-Oriented Language"](https://colorforth.github.io/POL.htm)
- [FORTH 2012 Standard](https://forth-standard.org/standard/intro)
- [FORTH ISO Standard](https://www.iso.org/standard/26479.html)
- [SwiftForth](https://www.forth.com/swiftforth/)

