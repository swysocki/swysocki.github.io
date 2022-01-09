---
layout: post
title: Docker Image Secrets the Right Way
tags:
  - devops
  - docker
  - containers
---
It is occasionally useful to pass sensitive information such as AWS credentials
(`.aws/credentials`) or authentication secrets when building a Docker image.
Regardless of the reason, this information is sensitive and care must be taken
to ensure that it is not leaked to consumers of the Docker image.

Docker users make the mistake of passing sensitive information to their
image via `--build-args` or as environment variables.  This has resulted in
[thousands of leaked secrets](https://redhuntlabs.com/blog/scanning-millions-of-publicly-exposed-docker-containers-thousands-of-secrets-leaked.html)
in public Docker images.

## The ARG Problem

It's tempting to pass secrets via `--build-args` to the `docker build` command. This
seems like the correct approach because the secret isn't hard-coded in the Dockerfile.
This is **not** what the ARG instruction is for and the issues caused by its use
are easy to demonstrate.

Here is an example `Dockerfile` that demonstrates using the `ARG` instruction
to set a secret for use in a `curl` command.

```dockerfile
FROM alpine

RUN apk update && apk add curl
ARG MY_SECRET
RUN curl -u "user:$MY_SECRET" https://ifconfig.me
```

Building this image requires the `--build-arg` to set the `MY_SECRET` variable. For
example: `docker build . -t blogtest --build-arg MY_SECRET="abcdefg"`.  Now the
image will use the value of `MY_SECRET` in the `curl` command.

The issue here is, again, the `ARG` instruction was not meant to handle secrets and
stores the variable in the Docker image's metadata. Viewing the Docker image's layer
history revels the value of the `ARG` variable `MY_SECRET`.

```shell
$ docker history blogtest
IMAGE          CREATED          CREATED BY                                      SIZE      COMMENT
d01dea2da844   17 minutes ago   RUN |1 MY_SECRET=abcdefg /bin/sh -c curl -u …   0B        buildkit.dockerfile.v0
<missing>      17 minutes ago   ARG MY_SECRET                                   0B        buildkit.dockerfile.v0
<missing>      17 minutes ago   RUN /bin/sh -c apk update && apk add curl # …   4.35MB    buildkit.dockerfile.v0
<missing>      6 weeks ago      /bin/sh -c #(nop)  CMD ["/bin/sh"]              0B        
<missing>      6 weeks ago      /bin/sh -c #(nop) ADD file:df538113122843069…   5.33MB 
```

## Buildkit to the Rescue

![obligatory meme](https://i.imgflip.com/60mf8u.jpg)

Previous versions of Docker had no straight-forward way of passing secrets when
building an image. It took great care and attention to detail to ensure that no
sensitive data remained in the image. The arrival of
[Docker Buildkit](https://blog.mobyproject.org/introducing-buildkit-17e056cc5317)
adds the [`--secret` option](https://docs.docker.com/develop/develop-images/build_enhancements/#new-docker-build-secret-information)
which provides a secure mechanism for passing sensitive information to an image.

We can rewrite the above example using the new Buildkit options.  This requires one
change to the `Dockerfile`.

```dockerfile
FROM alpine

RUN apk update && apk add curl
RUN --mount=type=secret,id=mysecret MY_SECRET=$(cat /run/secrets/mysecret ) \
  && curl -u "user:$MY_SECRET" https://ifconfig.me
```

We no longer need the `ARG` instruction.  Instead we use the `--mount` argument
with the `RUN` instruction.  This syntax mounts our secret to `/run/secrets/` in
a file named after the `id` option, in this case: `mysecret`. The content of that
file is then stored in our variable, `MY_SECRET`, so that we can use it in our `curl`
command.

We can take advantage of the updated `Dockerfile` by adding the new `--secret`
argument to our build command.  This example assumes we have set the environment
variable with our secret.

```bash
export MY_SECRET=abcdefg
docker build . -t blogtest --secret id=mysecret,env=MY_SECRET
```

Issuing the `docker history` command no longer reveals our secret.

```dockerfile
docker history blogtest
IMAGE          CREATED         CREATED BY                                      SIZE      COMMENT
ce5a8e6e0840   8 minutes ago   RUN /bin/sh -c MY_SECRET=$(cat /run/secrets/…   0B        buildkit.dockerfile.v0
<missing>      4 hours ago     RUN /bin/sh -c apk update && apk add curl # …   4.35MB    buildkit.dockerfile.v0
<missing>      6 weeks ago     /bin/sh -c #(nop)  CMD ["/bin/sh"]              0B        
<missing>      6 weeks ago     /bin/sh -c #(nop) ADD file:df538113122843069…   5.33MB
```

Success! No more leaked secrets. The image can now be safely distributed.

## A Couple Secret Secrets

There are a couple of rules to keep in mind when working with the `--mount` argument
in a Dockerfile.

- The secret you mount is available to its `RUN` instruction. Any following
`RUN` instructions will not have access to that secret.

- The secret is mounted to a directory in `/run/secrets` named after the
secret's `id`.

- The secret's destination can be set by adding the `dst` option. By default, the
secret's filename will be the `id` of the secret itself.

The `--secret` argument of `docker build` also has options which, at the time of
writing, are not well documented. One of the omissions is the source argument.
The example found in the Docker documentation [demonstrates](https://docs.docker.com/develop/develop-images/build_enhancements/#new-docker-build-secret-information)
the `src=<filename>` usage. But looking at the [source code](https://github.com/moby/buildkit/blob/4e69662758446c7dc0e6de2bc1f7973d03bacbed/cmd/buildctl/build/secret.go#L49)
reveals that the `env=<variable name>` is also a possible option (as demonstrated
in the above example).

Buildkit's secret handling is great way to improve the security of your Docker images.
Now is an excellent time to start adding it to your images. The feature will
reduce the amount of leaked secrets and allow your ops teams to rest a bit easier.
