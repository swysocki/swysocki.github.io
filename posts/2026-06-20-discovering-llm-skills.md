---
layout: post
title: Discovering LLM Skills
slug: 2026-06-20-discovering-llm-skills
tags:
  - devops
  - AI
  - llm
---
I've always struggled with web design. It's a shame because I love the _idea_ of having a modern blog, but I don't have the ability to create one. Exhibit A: [the previous version of this page](/images/swysocki_v1.png) and Exhibit B: [classicscores.com](/images/classicscores_v1.png). They couldn't be less inspiring, **which is good**, it's keeps me humble. It's a reminder that the part of my brain that _could_ be used to create aesthetically pleasing websites is being used for something else.  Hopefully the "something else" is important because I don't remember getting to vote on this.

In an act of desperation, I've tried to use website builders like [SquareSpace](https://ssquarespace.com) to create something that looks reasonably appealing. Astonishingly, I couldn't even use one of their templates to create something passable for a web designer. It seems like anything I do, beyond the default, becomes a scattered mess of whitespace issues, incoherent placement choices and lack of artistic skill. What I lack in design skills I make up for in determination, so I'm on a mission to fix it.

## LLM has Entered the Chat

All is not lost. Websites like SquareSpace have built in AI agents to aid you in designing your space.  I am sure they are useful, and would likely work well for me, but the first question that comes to mind is, "why not cut out the middleman?". SquareSpace isn't cheap and I have access to enough coding agent tokens to whip something up, so why not?

Of course, using an LLM to design a website skips over the operational details. The site needs to be hosted somewhere and all of that comes with those activities. Luckily, I'm already doing that, so I really don't need to enlist the help of anyone for that. So I'll skip over the mundane details of operating a static website.

What I really need is an agent that has a knack for design. I don't need help with the operations, and realstically I can _create the code_ myself. What I lack is an eye for design. I haven't been educated in why certains look good and, let me be honest, I really don't want to. I want someone to make my website look nice(r) than I can.

Okay, I've established a couple things on this process:

1. Design is out of my wheelhouse
2. I am going to use an LLM to make me whole
3. now what?

## Enter Human Interaction

I'm a bit clueless on where to begin, and I'm resisting the urge to ask an LLM how to use an LLM for this. So, much like the days before AI did all of the work for us, I reached out to a friend for some advice.  They pointed me to an "Agent skill" [nextlevelbuilder/ui-ux-pro-max-skill: An AI SKILL that provide design intelligence for building professional UI/UX multiple platforms](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill).

>I'm sure everyone that touches a keyboard has become familiar with agent skills, but if you are not, they are the modern equivalent of shareware that developers recklessly download and run on their local system. What could go wrong?

Thanks to my human interaction, I now have a direction. My friend also gave me a bit of advice on how to use this skill, a reference design they created with the skill, and some words of encouragement that I'm probably overthinking the process. Fair enough, on with the show.

**But first**, I'm a DIY type of guy. I built my janky website with **my bare hands** and I don't want to blindly turn the keys over to my coding agent. So before I run anything, I have to take a peak under the hood and see what this skill's instructions are. This is the point where it becomes clear to me that _I don't know WTF agent skills are_! My vision was a `SKILL.md` file with some encouraging words that provide my agent with parameters and guardrails. What I got was much more complex.

I'm not making any claims about the quality of the aforementioned skill, but I don't think I need Python, Typescript, a CLI and all of the features this project provides. I also don't want to abandon the hopes of having a more aesthetically pleasing website.  So I guess it's on to Plan B: creating my own skill.

## Skills Take Skill

I'm not an expert on writing skills for agents. If you haven't gathered by now, I barely know what I am talking about. What I do know, is that a skill is a thoughtful way to create reusable guidance for my agent to follow, but it's not the actual plan of execution. This _seems_ like exactly what I want, since web design is something I can't do, and I don't want my agent to go all #yolo on my current website.

Those points led me to [crafting my own `SKILL.md`](https://github.com/swysocki/swysocki.github.io/blob/master/.agents/skills/modern_ui/SKILL.md) file to create a better design for my website. I wrote down, in plain English, the guidance I wanted my agent to follow. I wanted a simple, modern, yet appealing website. Of course, it's not as easily accomplished as a single sentence, but something along those lines.

Within a few iterations, a few back-and-forth prompts with my coding agent, I had settled on a useful skill to update my website's UI. Far from perfect, but also better than I can do on my own. Adding the `SKILL.md` file to my project will allow my agent to reference the guidance and, with any luck, create something appealing and less embarrassing for me to share.

## The Reveal

The website you are seeing today, which is assuredly better designed than it was previously, is the result of a coding agent leveraging my entry-level effort to write a skill. I'm pleasently surprised with the cleanliness of it all, it seems to have followed my instructions, and it didn't break in my mobile browser. I'm going to call that a win for today!

I can see the appeal to this workflow; it allowed me to accomplish something don't have a knack for. Admittedly, I got a bit wrapped up in creating my own skill for something that has already been solved, but it added some fun to the process. I don't have any interest in downloading a tool, answering a couple of prompts, and letting "LLM take the wheel!".  I do thoroughly enjoy defining some rules, an outcome, and skipping the tedious parts. Maybe this is what modern developing is going to be..