---
layout: post
title: Docker Image Secrets the Right Way
tags:
  - devops
  - docker
  - containers
---
Occasionally it is useful to pass sensitive information to the `docker build` process.
It is typical to need AWS credentials (`.aws/credentials`) or an authentication
secret when building an image. Regardless of the reason, this information is
sensitive and care must be taken to ensure that this information is not leaked
to consumers of the Docker image.

Many Docker users have made the mistake of passing sensitive information to their
image via `--build-args` or as environment variables.  This has resulted in
[thousands of leaked secrets](https://redhuntlabs.com/blog/scanning-millions-of-publicly-exposed-docker-containers-thousands-of-secrets-leaked.html)
in public Docker images.

## The ARG Problem

It's tempting to pass secrets via `--build-args` to the `docker build` command. This
seems like the correct approach because the secret isn't hardcoded in the Dockerfile.
However, this is **not** what the ARG instruction is for and the issue is easy to
demonstrate.

Here is an example `Dockerfile` that demonstrates an attempt to use the `ARG` instruction
to set a secret for use in a `curl` command.

```
FROM alpine

RUN apk update && apk add curl
ARG MY_SECRET
RUN curl -u "user:$MY_SECRET" https://ifconfig.me
```

Building this image requires the `--build-arg` to set the `MY_SECRET` variable. For
example: `docker build . -t bad_idea --build-arg MY_SECRET="abcdefg"`.  Now the 
image can be created and will use the value of `MY_SECRET` in the `curl` command.

The issue here is, again, the `ARG` instruction was not meant to handle secrets and
the variable gets stored in the Docker image's metadata.  The value of the `ARG` variable
can be seen by simply view the Docker image's layer history:

```
$ docker history blogtest
IMAGE          CREATED          CREATED BY                                      SIZE      COMMENT
d01dea2da844   17 minutes ago   RUN |1 MY_SECRET=abcdefg /bin/sh -c curl -u …   0B        buildkit.dockerfile.v0
<missing>      17 minutes ago   ARG MY_SECRET                                   0B        buildkit.dockerfile.v0
<missing>      17 minutes ago   RUN /bin/sh -c apk update && apk add curl # …   4.35MB    buildkit.dockerfile.v0
<missing>      6 weeks ago      /bin/sh -c #(nop)  CMD ["/bin/sh"]              0B        
<missing>      6 weeks ago      /bin/sh -c #(nop) ADD file:df538113122843069…   5.33MB 
```



## Buildkit to the Rescue

Previous versions of Docker had no straight-forward way
of passing secrets and great care had to be taken to ensure nothing sensitive
was left in the image. The arrival of
[Docker Buildkit](https://blog.mobyproject.org/introducing-buildkit-17e056cc5317)
adds the `--secret` option which provides a secure mechanism for passing sensitive
information to an image.

> Docker Buildkit now provides a  


