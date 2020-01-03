import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  duration: '30s',
  rps: '1000',
};

export default function () {
  for (let id = 9000000; id <= 9001000; id += 1) {
    const res = http.get(`http://localhost:3001/?id=${id}`);

    check(res, {
      'status was 200': r => r.status === 200,
    });
  }

  sleep(1);
}
