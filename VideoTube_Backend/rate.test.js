import http from "k6/http";

export const options = {
  vus: 20,
  duration: "10s",
};

export default function () {
  const res = http.get("http://localhost:3000/api/v1/healthcheck");
  console.log(`Status: ${res.status}, Body: ${res.body}`);
}
