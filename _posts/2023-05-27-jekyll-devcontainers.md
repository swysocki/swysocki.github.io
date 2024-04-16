---
layout: post
title: Run Jekyll From a Devcontainer
tags:
    - programming
    - automation
    - jekyll
---

This blog is hosted with [GitHub Pages](https://pages.github.com/) which is an excellent, free hosting service.
Pages allow users to upload their sites as static resources.  This is most easily accomplished by using a
Static Site Generator and as luck would have it, Pages works with [Jekyll](https://jekyllrb.com/) out of the box.
This means all you have to do is create your Jekyll project, write some blog posts, and push the commit to GitHub.
GitHub will generate and publish the website without any extra configuration, which is convenient but eventually,
you will want to run your Jekyll site locally for development.

## Devcontainers or Bust

Setting up your development environment is an essential step in being able to program productively.  It's not
the most exciting step and can be a frustrating experience if you are unfamiliar with the language's tools, but
it is worth the effort when it comes time to dig into the code.  

I am not familiar with Jekyll's language of choice, [Ruby](https://www.ruby-lang.org).  I am barely
familiar with Jekyll itself so setting up an environment where I can test changes locally isn't something
I have done before.  I do, however, know that I want this environment to be repeatable and isolated so that
other projects I am working on don't interfere with it.  

This is where [devcontainers](containers.dev) shine. Devcontainers extend containers, like Docker, providing
base templates and development features in an easy-to-use format.  One of the provided templates is a
[Jekyll template](https://github.com/devcontainers/templates/tree/main/src/jekyll). This template won't work
with GitHub Pages because it will use the latest Ruby version by default.  Instead, I needed to use
Ruby 2.7 in the container but it wasn't obvious how to declare this variant.  I found the
[list of Devcontainer Jekyll image tags](https://mcr.microsoft.com/v2/devcontainers/jekyll/tags/list)
which allowed me to discover the `2.7-bullseye` tag.

This tag can be dropped into the container's JSON configuration to create a functioning Jekyll test environment
with very little effort.  The following `devcontainer.json` file is all that is needed to set up a functional
test environment.

```json
{
  "name": "Jekyll",
  "image": "mcr.microsoft.com/devcontainers/jekyll:2.7-bullseye",
  "features": {"ghcr.io/devcontainers/features/node": "1.2.0"}
  // The devcontainer ships with a postCreate.sh that runs `bundle install`
}
```
