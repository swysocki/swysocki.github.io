---
layout: post
title: I Wrote a Static Site Generator
slug: 2023-12-05-homemade-static-site-generator
tags:
    - programming
    - automation
    - jekyll
---

It's not that great static site generators (SSG) don't exist.  Let's be honest,
[we don't need more of them](https://jamstack.org/generators/). But that has never
stopped me before.  The motivation here was that I wanted something simple, with
minimal dependencies, tailorable to my needs.  My previous SSG, [Jekyll](jekyllrb.com),
works seamlessly with Github pages, making it an easy choice.  But Jekyll has way more
features than I need, making it harder to modify and more dependencies to manage.

I had very minimal criteria for my SSG:

1. I wanted to use my Jekyll files as-is. I didn't want to change any of the content if
I could avoid it. That will make the transition simple and allow me to migrate elsewhere
if I want.

1. My generator would be written in Python. I may change this later but for now, Python
will get me there quicker.

With that in mind, I needed to choose the building blocks of my generator.

## The Shoulders of Giants

The process was simpler than I expected, it's almost like the components are just lying around waiting to be assembled.  So that is essentially what I did. I knew I was going
to write it in Python from the start, so I filled in the blanks with some solid,
off-the-shelf libraries.

### Markdown to HTML Library

There are lots, but I chose [markdown-it-py](https://github.com/executablebooks/markdown-it-py)
which seems vastly underrated. It's a port of the
[markdown-it](https://github.com/markdown-it/markdown-it) Javascript library but doesn't
have quite as much traction.  Nonetheless, it has all the pieces I need.  The most
notable feature is the plugin system. I use the Plugin Extensions to read Markdown
[Front Matter](https://mdit-py-plugins.readthedocs.io/en/latest/#front-matter).
My old Jekyll posts contain Front Matter that I don't want to lose, so this piece is
important.

### Template Library

This is a no-brainer in Python, it's [Jinja](https://jinja.palletsprojects.com/en/3.0.x/).
Jinja is about as ubiquitous as a third-party library gets. It has everything you could
want from a templating library and I have a great deal of experience with it from other
projects.

## Putting it Together

I wrote what I assume is the typical formula for a generator:

* Read in Markdown files, converting them to HTML
* Add the converted HTML to templates
* Output the template to HTML files

With just a bit of Python "glue" was able to give myself a minimally functioning
generator in about 150 lines of code. It's nothing beautiful, but it's functional
and once I wire up CI/CD it will be automatic.

Unnecessary, sure but that wasn't the point. It was a fun little project and I'm
excited to continue extending [Staff Sergeant](https://github.com/swysocki/staffsergeant)
(because it's an SSG, get it?).
