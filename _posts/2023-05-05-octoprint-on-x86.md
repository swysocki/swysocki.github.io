---
layout: post
title: OctoPrint on x86
tags:
  - 3dprinting
  - automation
---

A few years ago I began a journey into 3d printing.  It has been a wonderful hobby for me
and I have learned a lot about the world of manufacturing and "making". Like many beginners,
I began with a budget printer from [Creality](https://store.creality.com/products/ender-3-v2-3d-printer?spm=..collection_90778a1d-d845-4ff0-a8c4-48fded4b7d74.albums_1.1).
These printers are inexpensive, insanely modifiable, and have a ton of community support.
I have been happy with my choice but there is one thing that I have always disliked about
it: the SD Card shuffle.

![OctoPrint and x86](/assets/images/blog_octo_x86.png)

## Enter OctoPrint

Most budget printers do not have network connectivity.  The main mechanism used to transfer
files to them is via an SD Card.  This "shuffle" always rubbed me the wrong way.  It is
tedious and error prone and I knew there had to be a way to simplify my workflow.  This is
where [OctoPrint](https://octoprint.org) comes in. OctoPrint is a wonderful, free, open-source
web UI for 3D printing.  Among the many things that OctoPrint provides, it allows printing
from a network connection.

## The Raspberry Pi Problem

OctoPrint is typically installed on a [Raspberry Pi](https://raspberrypi.org); a low-power,
low-cost, Arm-based, single-board computer.  An image called [OctoPi](https://github.com/guysoft/OctoPi)
exists for this very purpose.  It is almost a turn-key solution and can have OctoPrint up and
running quickly.  This is the option I wanted to use, _however_, I didn't own a Raspberry Pi.

It turns out that sourcing a Raspberry Pi is challenging in 2023. The Raspberry Pi was a very
economical option before the pandemic and you could secure a board capable of running Octoprint
for less than $50. Those boards are now well over $100 and typically out of stock.  That's unfortunate, but
I had a solution! 

## The Intel Option

I have an [Intel NUC](https://www.intel.com/content/www/us/en/products/details/nuc.html) mini-PC
that has served several purposes for nearly a decade.  It is no longer usable as a primary computing
device but has all of the features I need to build a capable OctoPrint server, namely WiFi and
a couple of USB ports.  The NUC will consume much more power than the Raspberry Pi and takes up
more space on my workbench, but up-cycling this device feels like a great choice.

## OctoPrint Installation

Installing OctoPrint is straightforward and there is nothing specifically different when installing
it on x86.  This [OctoPrint Forum post](https://community.octoprint.org/t/setting-up-octoprint-on-a-raspberry-pi-running-raspberry-pi-os-debian/2337)
is a useful guide and worked to get me up and running.

## USB Cable Hackery

OctoPrint communicates with my printer via a micro USB port on the main board. I used a standard
USB A to micro cable to connect my NUC to the printer. At this point, I found my printer's board
in a powered-on, partially booted state which prompted me to take a brief journey into the USB
specification.

USB ports, regardless of their connector type (A, micro, mini, etc.) provide 5 volts of DC power.
Most cables will happily pass this voltage through to a recipient.  This is why we don't have to
use external power for low-power devices like webcams and some hard disk drives. Unfortunately,
the Ender3 V2's main board does not operate properly when this voltage is applied and we need
a way to disable it.

USB cables separate power from signals using different wires. I saw two options to prevent my Ender 
from receiving the unwanted 5 volts: cut the power wires on the cable or cover the connector
pins providing power.  I chose the latter option because it seemed a bit cleaner than opening
the USB cable's shielding and cutting the wires.  I used a bit of tape to cover the USB A's pins
to prevent them from connecting with the port's power.  This worked as expected and the printer's
board no longer partially booted.

![USB A cable with a power pin taped over](/assets/images/usb_power_disable.jpg)

## Serial Connection 

Now that the power is no longer powering our main board it is time to move on to enabling
the serial connection that the USB cable provides. The OctoPrint web UI provides a dialogue
to configure the serial connection to the printer.  I knew I was using `/dev/ttyUSB0` and my
baud rate but was simply unable to connect.  

Undiscouraged, I decided to manually connect
to my `/dev/ttyUSB0` device using the `screen` utility.  If the connection is successful, you 
will receive G Code in the terminal.  I was only able to connect and receive G Code when I ran
`screen` as the `root` user.  This means that the user running the OctoPrint service did not
have permission to access the `/dev/ttyUSB0` device.  You can enable access, on Ubuntu 22.04, by
adding the user running OctoPrint to the proper groups.

```bash
sudo usermod -aG tty,dialout $USER
```

This will add your user to the proper groups for access to the `/dev/ttyUSB0` device. Change the
`$USER` variable if you are running OctoPrint under a different user.

## The Long Awaited Wireless Print

Now with everything set up, I can slice, upload my G Code, and begin a print directly from my 
computer.  I no longer have to shuffle SD cards or leave the comfort of my desk; my workflow is
beautifully simplified. OctoPrint is a high-quality piece of software providing a wealth of
capabilities. Its ability to run on low-power hardware makes it perfect for installing on outdated
hardware like my decade-old NUC.  I highly recommend testing OctoPrint and if you like it,
[contribute to its development](https://octoprint.org/support-octoprint/).
