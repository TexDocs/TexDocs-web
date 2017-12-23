#!/usr/bin/env bash

WASM_DIR="${PWD}"

function fix_runtime {
    sed -i '' 's/Module\.nodejs/false/g' $1
    sed -i '' 's/fetch. \"/fetch\( \"\/static\/wasm\//g' $1
}

cd ${WASM_DIR}/rtvcs
cargo web build --target-webasm --release --bin "rtvcs_web"
cp ./target/wasm32-unknown-unknown/release/rtvcs_web.js ${WASM_DIR}/../static/wasm/
cp ./target/wasm32-unknown-unknown/release/rtvcs_web.wasm ${WASM_DIR}/../static/wasm/
fix_runtime ${WASM_DIR}/../static/wasm/rtvcs_web.js

cd ${WASM_DIR}/websocket_api
cargo web build --target-webasm --release --bin "websocket_api_web"
cp ./target/wasm32-unknown-unknown/release/websocket_api_web.js ${WASM_DIR}/../static/wasm/
cp ./target/wasm32-unknown-unknown/release/websocket_api_web.wasm ${WASM_DIR}/../static/wasm/
fix_runtime ${WASM_DIR}/../static/wasm/websocket_api_web.js