
# Markdown(ish)

We have written the manual in markdown, and use a simple markdown-to-html program to turn it into something that may be read with the web app. 

We call this "markdown-ish" because we do break some markdown rules, and invent a few of our own. Some of this is for ease of implementation, others because certain aspects of markdown bother me.

For instance, paragraphs are currently a single line. I normal markdown a paragraph is marked by an empty line before and after. Thus a paragraph may contain line breaks, which are not reflected in the formatted output ... the line breaks are essentially joined together. This accomodates editors which do not support dynamic wrapping.

Our processing model is line-based. Read the first word of a line, and then the rest of a line. If it is a directive, process the rest of the line according to the directive. If it is not a directive, we consider the entire line a paragraph.

An example of feature, or syntax rather, addition is list processing. I've always found the rules for markdown list processing rather finicky. It is easy to get wrong, especially with nested lists and more complex content within lists. Markdown tries hard to have the source markdown be perfectly readable as it is written. Thus lists have no decoration other than the list item marker, and list end and sublists are all determined by whitespace and indentation. This is the source of the problem. Aligning text with whitespace in lists is just plain difficult.

So I've opted for explicit markers for list begin and end. This may be more verbose, but it is at least clear.


E.g. 

```markdown

- list item 1
- list item 2
    - sublist item 1
    - sublist item 2
- list item 3
    - sublist item 1
        - sub-siblist item 1
            - sub sub sub list item 1!
            
```

becomes 

```markdownish

@list
- list item 1
- list item 2
  @list
    - sublist item 1
    - sublist item 2
  @end
- list item 3
  @list
    - sublist item 1
      @list
        - sub-siblist item 1
          @list
            - sub sub sub list item 1!
          @end
      @end
  @end
@end

```

I think the below will work, as long as we are disciplined about indenting. Without proper tabs or strict tab spacing, this is difficult to work with. At least I've always found it that way.


- list item 1
- list item 2
    - sublist item 1
    - sublist item 2
- list item 3
    - sublist item 1
        - sub-siblist item 1
            - sub sub sub list item 1!

A clearer, if less "markdowny" approach is to excplicityly start and end lists. This may also make it easier to include formatted content within list items.

<ul>
- list item 1
- list item 2
    <ul>
    - sublist item 1
    - sublist item 2
    </ul>
- list item 3
    <ul>
        - sublist item 1
            <ul>
            - sub-sublist item 1
                <ul>
                - sub-sub-sub list item 1!
                </ul>
            </ul>
    </ul>
</ul>

or perhaps:

@begin list
- list item 1
- list item 2
  @begin list
    - sublist item 1
    - sublist item 2
  @end list
- list item 3
  @begin list
    - sublist item 1
      @begin list
        - sub-siblist item 1
          @begin list
            - sub sub sub list item 1!
          @end list
      @end list
  @end list
@end list

or perhaps:

@list
- list item 1
- list item 2
  @list
    - sublist item 1
    - sublist item 2
  @listend
- list item 3
  @list
    - sublist item 1
      @list
        - sub-siblist item 1
          @list
            - sub sub sub list item 1!
          @listend
      @listend
  @listend
@listendist

or perhaps:

@list
- list item 1
- list item 2
  @list
    - sublist item 1
    - sublist item 2
  @end
- list item 3
  @list
    - sublist item 1
      @list
        - sub-siblist item 1
          @list
            - sub sub sub list item 1!
          @end
      @end
  @end
@end

and then 

@numbered-list
- list item 1
- list item 2
  @numbered-list
    - sublist item 1
    - sublist item 2
  @end
- list item 3
  @numbered-list
    - sublist item 1
      @numbered-list
        - sub-siblist item 1
          @list
            - sub sub sub list item 1!
          @end
      @end
  @end
@end

and then 

@numbered-list

- list item 1
- list item 2

  @numbered-list
    - sublist item 1
    - sublist item 2
  @end
  
- list item 3

  @numbered-list
    - sublist item 1
    
      @numbered-list
        - sub-siblist item 1
        
          @list
            - sub sub sub list item 1!
          @end
          
      @end
      
  @end
  
@end

or perhaps:

@list
list item 1
list item 2
  @list
  sublist item 1
  sublist item 2
  @end
list item 3
  @list
  sublist item 1
      @list
      sub-siblist item 1
          @list
          sub sub sub list item 1!
          @end
      @end
  @end
@end
