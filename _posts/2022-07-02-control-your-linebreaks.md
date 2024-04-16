---
layout: post
title: Line Length Still Matters
tags:
  - devops
  - software engineering
  - editor
---
A battle as old as writing code itself: editor line length.  We recently had this
discussion at work and some of the criteria for line length were quite surprising.
For the record, I have always tended toward short line lengths of 80-88 columns.
Like most things, I am open to a new perspective; my preference is never set in stone.
I do believe there are more advantages to keeping line lengths short and I'm
going to explain them here.

I recently listened to the [Co-Recursive podcast](https://corecursive.com/)
episode which gives a great background on the
[80-column tradition](https://corecursive.com/why-80-columns/).
Some of those details are interesting from a historical perspective but aren't
the reason I chose a shorter line length over a long one. Punch cards column
count is a fun bit of trivia and
[Chesterton's Fence](https://www.chesterton.org/taking-a-fence-down/)
is an excellent concept to keep in mind, but neither is a good reason for short
line lengths in the current world.

## Limited Line Length

I have two reasons why I prefer short lines over long ones.  The first has to do with
the ease of reading.  I am sure I am not alone in the fact that I tend to read
more code than I write. Have you ever noticed how short newspaper and magazine
lines are? They are short because studies have shown that
[limiting line length](https://en.wikipedia.org/wiki/Line_length) aids in the
legibility of media.  We aren't reading the newspaper, but I feel the same
concepts apply.  Allow me to demonstrate.

Let's look at a long line that may exist in a Bash script:

```bash
docker run --rm --interactive --tty --env ENV_VAR=myvariable --volume /home/swysocki/code:/code --workdir /code ubuntu:20.04 /bin/Bash
```

This isn't a logically complex command but it takes a bit of work to digest
due to its length. Reducing the line length and breaking up the command makes this
much easier to comprehend.

```bash
docker run \
  --rm --interactive --tty \
  --env ENV_VAR=myvariable \
  --volume /home/swysocki/code:/code \
  --workdir /code \
  ubuntu:20.04 /bin/bash
```

I suppose this is an unfair example; it's more about *formatting* than the line
length. Code formatted for readability normally has short lines to begin with.
But there is another reason why I prefer constrained lines, which is the
reduced readability of unintended linebreaks.

When line length is not constrained, or when line length settings are overly long, lines
will break at different locations depending on the user's setup. This can be impacted
by font size, monitor size, resolution settings and more. A long line of code that has a
line break inserted in it can be much harder to read.

I'm going to use a Python class `__init__` method declaration as an example.

```python
def __init__(self, name: str = "", size: int = 0, partition_guid: Union[None, uuid.UUID] = None, alignment: int = 8)
```

That line is 116 characters and would likely have a line break inserted if you have your
editor in a vertical split. If your split editor can only display 100 lines, it would
look much less readable.

```python
def __init__(self, name: str = "", size: int = 0, partition_guid: Union[None, uuid.UUID] = None,
alignment: int = 8)
```

Manually reducing the line length to avoid the line break will make this much easier to
consume when reading. Python's venerable [Black Formatter](https://github.com/psf/black)
will produce this output when a line crosses the 88-column boundary:

```python
def __init__(
    self, name: str = "", 
    size: int = 0, 
    partition_guid: Union[None, uuid.UUID] = None,
    alignment: int = 8
)
```

I strongly prefer the shortened version to the one with an arbitrary line break. I don't
think the original, 116-character version, is hard to read *until* the line break is
introduced. When it is, the declaration loses its formatting and is much harder to read.

## Agree to Agree

I recommend agreeing on the line length as a project or team. Not everyone has the same
editor configuration or monitor setup. Some developers enjoy working on smaller screens
such as laptops while others use a single editor panel with no vertical splits.

Line length is part of the bigger picture, once a team agrees on an acceptable length
they should
[adopt a code formatter](https://github.com/rishirdua/awesome-code-formatters).
Every language has great code format utilities that work in concert with popular
editors. Agree on your formatting configuration, including
the maximum line length, codify that configuration and share it amongst your team. It
will be one less distraction your team has to deal with.
