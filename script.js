import http from "k6/http";
import { sleep } from "k6";

export let options = {
  vus: 10,
  duration: "30s",
  rps: "1",
};

export default function () {
  // http.get("http://test.loadimpact.com");
  http.get("http://localhost:3001/?id=77");
  sleep(1);
};