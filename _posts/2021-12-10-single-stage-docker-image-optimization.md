---
layout: post
title: Single Stage Docker Image Optimizations
tags:
  - devops
  - docker
  - containers
---
Docker images are simple to create; add a handful of commands to a `Dockerfile`,
run `docker build . -t my-image` and out comes a beautiful, hand-crafted Docker
image ready to be used.  This simplicity is beautiful but also a double-edged sword.

Creating a production ready Docker image takes optimization and this beautiful simplicity
becomes much more complex.  Image size reduction is one of the first optimizations 
made when preparing Docker images for production.  While image size and layer 
optimization should be a priority preparing an image for production, proper use of
the Docker cache is essential.

> Production Docker images should optimize cache usage not just layer size

Although optimizing images can be best accomplished using multi-stage builds, I am
focusing on a single-stage approach. This is mainly because the patterns highlighted
here can be used in single or multiple staged builds.

## The Docker Mono-Layer

When Docker images are initially optimized I often see the pattern of installing packages
in one fell swoop.  For example, it is common to use multiple package managers in a
single layer to optimize size and reduce layer count.

Let's use the example of installing the popular Python 
[requests](https://docs.python-requests.org/en/latest/) package on a Debian base image.

```
# Dockerfile
FROM debian:bullseye
RUN apt-get update && \
  apt-get install -–no-install-recommends --yes \
  python3-pip && \
  rm -rf /var/lib/apt/lists/* && \
  pip3 install requests
```

This results in a single layer added to our new image. Using the `docker history` command the
results can be inspected.

```
IMAGE          CREATED          CREATED BY                                      SIZE      COMMENT
538caa27ded2   11 seconds ago   RUN /bin/sh -c apt-get update &&   apt-get i…   44.7MB    buildkit.dockerfile.v0
```

The image now has an additional layer that added 44 MB on disk. This is relatively compact 
and demonstrates combining package managers, `apt-get` and `pip`, while installing multiple packages with them. 
It's tough to argue that there is a downside to this pattern, but what happens when an additional
package needs to be installed?

## Leverage the Cache

In the first example the purpose was to install the `requests` package so it makes 
sense to have a layer encompassing those steps. Separating that layer into a layer
for each package manager will allow further optimization while barely increasing the
size of the total image.

```
# Dockerfile
FROM debian:bullseye
RUN apt-get update && \
  apt-get install -–no-install-recommends --yes \
  python3-pip && \
  rm -rf /var/lib/apt/lists/*
RUN pip3 install requests
```

Once again `docker history` can be used to inspect the image results. Some quick
math shows that the additional layer has a negligible impact on total size.

```
IMAGE          CREATED          CREATED BY                                      SIZE      COMMENT
7781901ba6fb   8 seconds ago    RUN /bin/sh -c pip3 install requests # build…   2.56MB    buildkit.dockerfile.v0
<missing>      10 seconds ago   RUN /bin/sh -c apt-get update &&   apt-get i…   42.1MB    buildkit.dockerfile.v0
```

Having a separate layer for the `apt-get` commands and the `pip` commands allows efficient
use of Docker cache.  In the next example an additional Python package, the wonderful
[rich](https://github.com/willmcgugan/rich), is added to the image.

```
# Dockerfile
FROM debian:bullseye
RUN apt-get update && \
  apt-get install -–no-install-recommends --yes \
  python3-pip && \
  rm -rf /var/lib/apt/lists/*
RUN pip3 install requests rich
```

Docker Buildkit will now pull the layer created with the `apt-get` commands from cache and create a
new layer created by the `pip` command.  This will dramatically increase the speed of the build as
`apt-get` will not need to be run. If the Dockerfile was still using a single layer
the entire `apt-get` command would need to be re-run.  In this case only the `pip` step
changes, resulting in a much more efficient image build.

Buildkit's output will reflect that the cache is being used by marking the layer as `CACHED`. This
denotes successful use of the caching mechanism and a reduction in build time.

```
=> CACHED [2/3] RUN apt-get update &&   apt-get install --no-install-recommends -y   python3  0.0s
```

It's important to realize the power of utilizing the Docker cache when building images.
The are many caveats to its use; layer ordering and command functionality will
influence whether the cache is used or not. At this time there doesn't appear to be
any good documentation, but watch the 
[Buildkit Repo](https://github.com/moby/buildkit#cache) for updates.

## Simple Optimizations with Large Impacts

The results of these small cache optimizations can have a huge influence on build time 
and bandwidth usage in modern CI/CD systems.  The previous example is quite compact
but in production a Docker image may download many gigabytes of packages or SDK's. 

Creating modular, cacheable layers will have a positive effect on many facets of application infrastructure.
Optimized builds reduce pipeline execution time, container deployment time, save storage space and
reduce bandwidth costs.  Spend some time reviewing and improving your Docker image declarations, it will
have a large impact on your DevOps environment.