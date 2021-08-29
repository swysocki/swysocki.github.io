---
layout: post
title: The Tyranny of Latest
tags:
  - devops
  - docker
  - containers
  - sre
---
We've been bitten by this over and over.  Something that worked yesterday
no longer works today.  You hear the cries, "I didn't change anything,
it just broke!™".  Well, _something_ changed and when it comes to runtime
environments, my instinct is to look for changes caused by a reusable
reference such as "stable", "latest" or omitted versions.

>  To avoid unexpected pain, production systems should always be built from 
explicit versions.

## Implicit Versions are Convenient, Initially

I'm going to pick on Docker image versioning and the `latest` tag here, but this
issue also applies to systems such as `pip` that allow the user to omit explicit 
versions.  The Docker tag named `latest` is a reference that points to particular
Docker image. _Typically_ this will be the newest version of the image
[but that is not enforced, it's convention](https://vsupalov.com/docker-latest-tag).

Regardless of where `latest` points its implicit nature is the issue. An alias like
`latest` is a big convenience when you are initially building applications. 
Typically you don't know (or care) what version of an image you want and it makes
sense to allow the image maintainer chose for you.  However, when you move to a
production environment this is needlessly risky.

An implicit version like `latest` changes without warning each time your runtime
environment is launched.  The convenience you received when building the application 
is now a detriment.

## Things Break in Sneaky Ways

Let's rewind to the original, common cry from teams that are impacted by the
"I didn't change anything, it just broke™" tyranny. I am sympathetic to this because things
*did* just stop working, but obviously *something* changed.  Now the fun part
begins: tracking down the actual issue. 

![obligatory meme](https://en.meming.world/images/en/4/4a/Modern_Problems_Require_Modern_Solutions.jpg)

If you suspect a Docker image changed due to an update to the `latest` reference, you 
will need to find the output of a the last successful launch of the runtime environment
and compare the two. Since we can no longer rely on the image's tag for comparison, we
will need to compare the image's **manifest hash**.  This is a bit tricky and I suggest you
[read this first](https://blog.aquasec.com/docker-image-tags). Once you understand what
you are looking for, compare a successful launch's manifest hash
to the hash of the broken build. If they are different you may have found your smoking
gun. Now re-launch with the old hash and if things are working you under exactly
why unstable tags are evil.

## How Specific is Specific?

In the case of Docker images, explicit versions can be a challenge.  I'm obviously advocating
against using the `latest` tag, but then which tag should be used? Answering this takes
some thought and inspection as images have no strict requirements for tags. Let's use
an example to demonstrate the process.  

Let's use a Linux distribution as an example.  [Ubuntu's Docker image](https://hub.docker.com/_/ubuntu) is
a perfect place to start. Ubuntu arranges their tags with a few levels of hierarchy.  At the top are
`latest`, `rolling`, `devel`, etc.  These tags are convenient but not stable and will 
change frequently.  The next, more specific tags is the distro name, such as `focal` or number
such as `21.04`.  This tag _may_ be more stable, but is still going to change as updates or rolled out.
The most specific tag offered by Ubuntu is a release with a distro name and timestamp, such
as `focal-20210723`.  Using this tag will ensure the underlying Ubuntu system is stable
until the tag is changed by the consumer.  This is the right amount of specificity for 
production systems.

The point is, you will have to do a bit of detective work to find the stable tag to use in
your application.  Do not assume that a tag like `21.04` we remain stable even though it
*seems* specific.

## This Seems Like a Lot of Work

It is.  It can be tedious but so is tracking down the "I didn't change anything, it just broke™"
issue as well. The upside is we have modern conveniences such as Helm, Ansible and a thousand
other tools to reduce the burden.

The reality is, **if you aren't using stable versions you will have an outage related to the underlying
environment mutating unexpectedly**. So get into the habit of setting versions explicitly, you will
sleep better at night.
