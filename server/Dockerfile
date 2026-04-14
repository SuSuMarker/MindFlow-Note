FROM rust:1.78-slim AS builder

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates pkg-config libssl-dev \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY server/Cargo.toml server/Cargo.lock /app/server/
RUN mkdir -p /app/server/src \
  && printf "fn main() {}\n" > /app/server/src/main.rs \
  && cargo build --release --manifest-path /app/server/Cargo.toml \
  && rm -rf /app/server/src

COPY server/src /app/server/src
RUN cargo build --release --manifest-path /app/server/Cargo.toml

FROM debian:bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates curl \
  && rm -rf /var/lib/apt/lists/*

RUN useradd --uid 10001 --create-home mindflow

WORKDIR /app
COPY --from=builder /app/server/target/release/server /usr/local/bin/mindflow-server

ENV MINDFLOW_BIND=0.0.0.0:8787 \
  MINDFLOW_DB_URL=sqlite:///data/mindflow.db \
  MINDFLOW_DATA_DIR=/data

EXPOSE 8787
VOLUME ["/data"]

USER mindflow
CMD ["mindflow-server"]
