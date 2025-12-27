---
layout: project
title: Projects
slug: projects
tags:
  - software
---

## Staff Sergeant

I started hosting my personal website on GitHub Pages as a static site. In the spirit of simplicity I used the [Jekyll Static Site Generator](https://jekyllrb.com/)
because of its configuration-free integration with GitHub. I quickly became overwhelmed by its complexity and began searching for alternatives, of which there are
plenty. Unfortunately, nothing I found was _simple_.

I decided to write my own Static Site Generator (SSG) and named it [Staff Sergeant](https://github.com/swysocki/staffsergeant) as a nod to the acronym `SSG`.  This
began as a single Python script that would convert my existing Markdown posts into HTML, leaving the Jekyll front-matter intact. Not much has changed, I still
endeavor to keep things simple, but I have also begun extending it slightly, just to make it a bit more useful for me.

## Classic Scores

A purposely simple webpage that stores early-era paintball tournament scores. Paintball has been a huge part of my life and I noticed a void in historical tournament
data. Most of the scores from the 80's, 90's, and early 2000's were only published in magazines or on websites that no longer exist. I have spent many evenings
gathering as much of this data as possible and publishing it to [www.classicscores.com](https://www.classicscores.com).

The website's data source has evolved from a spreadsheet into a single JSON file to store all of the scores. I chose this to allow the data to be indexed and archived
so it can eventually outlast me. While putting the data into a traditional database would be a more traditional approach, it would prevent it from being accessible long term.

## GPT Image

I wrote [a disk imaging tool](https://github.com/swysocki/gpt-image) in a previous role. This tool packaged firmware components into a
[GUID Partition Table](https://en.wikipedia.org/wiki/GUID_Partition_Table) image. This image was stored as a binary on a file system so it had no need to interact with the
underlying disks. This allowed me to run everything natively in Python, unfortunately [the best Python partitioning tool](https://github.com/dcantrell/pyparted) wasn't
cross-platform and missed a few features that I needed. That prompted me to build my own Python implementation of the GUID Partition Table image tool.

This turned out to be a great experience and, although it's niche utility, has been useful as an Open Source tool. The [GPT Image](https://github.com/swysocki/gpt-image)
package receives [hundreds of downloads a week](https://pypistats.org/packages/gpt-image)
so it is useful to someone out there.  The project has been extremely stable and required very few bug fixes so it doesn't seem as active as other Open Source projects.
Don't worry, it's not abandoned, it just doesn't need any new fixes or features at the moment.
