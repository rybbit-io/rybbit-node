import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { Rybbit } from "../dist/index.mjs";

const config = { analyticsHost: "https://rybbit.example.com/api/", siteId: "2", apiKey: "rb_test_key" };

let calls;
let realFetch;

beforeEach(() => {
  calls = [];
  realFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    calls.push({ url, headers: new Headers(init.headers), body: JSON.parse(init.body) });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  };
});

afterEach(() => {
  globalThis.fetch = realFetch;
});

test("sends the API key as a Bearer header, never in the body", async () => {
  await new Rybbit(config).pageview({ hostname: "example.com", pathname: "/", ip_address: "203.0.113.7" });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://rybbit.example.com/api/track");
  assert.equal(calls[0].headers.get("authorization"), "Bearer rb_test_key");
  assert.equal(calls[0].headers.get("content-type"), "application/json");
  assert.deepEqual(calls[0].body, {
    site_id: "2",
    type: "pageview",
    hostname: "example.com",
    pathname: "/",
    ip_address: "203.0.113.7",
  });
});

test("custom events carry the name and JSON-encoded properties", async () => {
  await new Rybbit(config).event("signup", { pathname: "/join" }, { plan: "pro", seats: 3 });

  assert.equal(calls[0].headers.get("authorization"), "Bearer rb_test_key");
  assert.deepEqual(calls[0].body, {
    site_id: "2",
    type: "custom_event",
    pathname: "/join",
    event_name: "signup",
    properties: JSON.stringify({ plan: "pro", seats: 3 }),
  });
});

test("debug logging does not print the API key", async () => {
  const lines = [];
  const realLog = console.log;
  console.log = (...args) => lines.push(JSON.stringify(args));
  try {
    await new Rybbit({ ...config, debug: true }).pageview({ pathname: "/" });
  } finally {
    console.log = realLog;
  }
  assert.ok(lines.length > 0);
  assert.ok(!lines.join("\n").includes("rb_test_key"));
});
