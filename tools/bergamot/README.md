# Bergamot

Bergamot is the tool we use for translating locally in the browser, even offline.

In order to get the relevant wasm files, we must run:

```
docker build --platform linux/amd64 -t bergamot .
```

To run a server and make sure the build was successful, run:

```
docker run -it -p 80:80 bergamot
```

Then we copy the worker files to the `bergamot` directory.
