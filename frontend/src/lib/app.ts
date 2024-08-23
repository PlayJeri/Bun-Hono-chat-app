import { hc } from "hono/client";
import { AppRoutes } from "@backend/src/index"

const client = hc<AppRoutes>("http://localhost:3000");


export async function logInUser() {
	// const res = await client.auth.login.$post(form: { username: "IsoMies", password: "isomolc" });
	const res = await client.auth.login.$post({ json: { username: "IsoMies", password: "isomolc" }});
	console.log(res);
	console.log(res.json())
	console.log(res.body)
	console.log(res.text);
	if (res.status === 200) {
		return await res.json();
	} else {
		console.log(res);
		throw Error("Invalid shit")
	}
}
