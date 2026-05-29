There is lots to do, but here is my current list of things I want to achieve soonish:

## vocabulary namespacing

This is important for creating domain-specific vocabularies (dictionaries). It also helps divide up vocabs to make working on them and testing easier.

## UI

At the moment, here is what I'm thinking.

One variant, the graphic UI is, for development at least, a  horizontally split screen with the upper area graphic (initially canvas), and the lower area split vertically with one area for interaction (input) the other for feedback (output).


The other variant would swap the graphic area for a text-based (ncurses-like) area.

The idea is that, ultimately, the window can be full-screened so that one can live in this little forth world.

### Discoverable

After being away from this for months, it is clear that it needs to be more discoverable. What I mean is that a user may hover over any or at least many elements to disocver what they mean.

The discoverable ui should probably be a tooltip, but we may also want to use a universal documentation panel which is displayed on each interactable page, or maybe every page.

We may want this to be collapsible, so that experienced users can regain some working space.

### Contextual Help

In addition, there should be actual ui elements to allow a user to explore features. What I mean is a more explicity interface, like little help buttons.

It could use the same universal help interface mentioned above to assist discoverability, but it may be a separate slide-in panel in order to get more vertical space. Or perhaps just a separate tab or window that displays a canonical help document, jumping to the appropriate section.

## WASM

Yeah, I want the compiler and interpreter to be written in WASM, and for the compiled code to be wasm as well. 


## CAse

Make case insensitive

## Docs

Start documenting our design, ideas, differences from Forth, lack of understanding of Forth, and so on, and so ____.
