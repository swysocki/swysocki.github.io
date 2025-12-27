---
layout: post
title: gpt-image, an Open Source Disk Partition Library
slug: 2024-08-10-gpt-image-open-source-library
tags:
    - programming
    - python
---

I have been searching for something to write about for nearly a year, so I thought
I would introduce a small, Open Source project I wrote. It's a Python project called
[`gpt-image`](https://github.com/swysocki/gpt-image) that can create
[GUID Partition Table](https://en.wikipedia.org/wiki/GUID_Partition_Table)
disk images _as a file within an existing filesystem_.  This is in contrast to many GPT
libraries that operate on an underlying device or loopback device. The inspiration for
this library comes from the need to create firmware disk images in GPT form. I needed
something light, flexible, and preferably, cross-platform.

## High-Level GPT Details

You are likely familiar with the GPT specification if you have formatted disks or created
Raspberry Pi disk images. It is a well-established standard, used by many (maybe most)
operating systems. It is the successor to the Master Boot Record (MBR) standard and allows
for much more complex partitioning of a disk.

The majority of the GPT specification details the header and table structures. These structures
contain all of the partition information for the disk. They are duplicated, one at the start
of the disk image and one, that acts as a backup, at the end of the disk. Consumers of GPT disks
load those structures, providing a mapping of the start block, end block, ID and a host of other
information about a partition. It is a relatively simple structure and a great place to
practice building a software utility to a given specification.

My GPT implementation does not try to replace other libraries like [`libparted`](https://www.gnu.org/software/parted/).
It is focused on creating small disk images, something that can fit into the host's memory. If a very large
image is needed, `parted` is likely a better choice.  If you are making device images for
embedded devices like Raspberry Pi, STM32, etc., you may find that `gpt-image` is a good choice.

The library itself is simple. It uses only the Python standard library and is written in pure
Python to avoid any compilation steps. This keeps the library portable and should be usable on
any operating system where Python exists.

## Contributions

I recently received my [first contribution](https://github.com/swysocki/gpt-image/pull/54) which was very flattering and added the
ability to edit partitions. I welcome all PRs that add stable, meaningful features to
the library and I encourage anyone who finds a bug to open an issue. You will get prompt feedback.
This library gets used hundreds of times a day at my day job with [Ampere](https://www.amperecomputing.com)
and has been incredibly stable. That means the release cadence of `gpt-image` is relatively
slow, which can be beneficial if managing dependencies is part of your job description. On the
flip side, it may look like the project is unmaintained, and I assure you it's not! It's a
critical part of our workflow and will continue to receive attention as needed.

## Feedback

I appreciate your feedback on the project. It is my first effort to provide an Open Source alternative
to an existing utility.  If you find it useful I would love to hear about it! Stop by the Github
project, leave a star, open an issue or submit a Pull Request.