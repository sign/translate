# Steps from https://github.com/browsermt/bergamot-translator
# docker build --platform linux/amd64 -t bergamot .
# docker run -it -p 80:80  bergamot
# docker cp 4f0ed685abd1:/bergamot-translator/build-wasm/bergamot-translator-worker.wasm src/assets/models/bergamot/bergamot-translator-worker.wasm
# docker cp 4f0ed685abd1:/bergamot-translator/build-wasm/bergamot-translator-worker.js src/assets/models/bergamot/bergamot-translator-worker.js

# python required by emcmake
FROM python:3.9.13

RUN apt-get update
RUN apt-get install -y git git-lfs cmake

# WASM prerequisites
RUN git clone https://github.com/emscripten-core/emsdk.git
WORKDIR emsdk
RUN ./emsdk install 3.1.8
RUN ./emsdk activate 3.1.8
# RUN /bin/bash -c "source ./emsdk_env.sh"

# Compile
WORKDIR /
RUN git clone https://github.com/browsermt/bergamot-translator.git
WORKDIR bergamot-translator
RUN mkdir build-wasm


WORKDIR build-wasm
RUN /emsdk/upstream/emscripten/emcmake cmake -DCOMPILE_WASM=on -DWORMHOLE=off ../
RUN /emsdk/upstream/emscripten/emmake make -j2
RUN bash ../wasm/patch-artifacts-import-gemm-module.sh

# Test server
WORKDIR /bergamot-translator/wasm/test_page
RUN apt install nodejs npm -y
RUN npm install
RUN chmod +x start_server.sh
# Get models
RUN git clone --depth 1 --branch main --single-branch https://github.com/mozilla/firefox-translations-models/
RUN mkdir models
RUN cp -rf firefox-translations-models/registry.json models
RUN cp -rf firefox-translations-models/models/prod/* models
RUN cp -rf firefox-translations-models/models/dev/* models
RUN gunzip models/*/*

ENTRYPOINT ["./start_server.sh", "../../build-wasm"]

