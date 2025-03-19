import { vi } from "vitest";

async function enableMocking() {
    const { worker } = await import("./browser");

    // `worker.start()` returns a Promise that resolves
    // once the Service Worker is up and ready to intercept requests.
    return worker.start();
}

function prepareForTests() {
    const parent = document.createElement("div");
    document.body.appendChild(parent);
    const h1 = document.createElement("h1");
    h1.textContent = "Website";
    parent.appendChild(h1);
    document.cookie = `CSRF_TOKEN="123"`;
    return parent;
}

export default function setupPage() {
    return enableMocking().then(prepareForTests);
}
