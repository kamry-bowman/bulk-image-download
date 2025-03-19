// Start request interception by starting the Service Worker

import { expect, test } from "vitest";
import setupPage from "./mocks/setupPage.js";
import { getByText } from "@testing-library/dom";
import { downloadImagesAndMetadata } from "../../lib/downloader.js";

function getUrlAndHeadersFromAssetsAndCounts(
    { host, rawCookies, csrfToken },
    count
) {
    const url = host + `/api&offset=${count}`;
    const headers = {
        "csrf-token": csrfToken,
        cookie: rawCookies,
    };
    return { url, headers };
}
function getNeededAssetsFromPage() {
    try {
        // in practice this can be grabbed from window or document as needed, such as window.locaction.host
        const host = "example.com";
        const cookies = document.cookie;
        const csrfToken = cookies.match(/="(\w+)"/)?.[1];
        return {
            host,
            rawCookies: cookies,
            csrfToken,
        };
    } catch (err) {
        console.error(err);
    }
}
function getImageUrlsAndMetadata(data) {
    const result = [];
    for (const item of data?.profiles || []) {
        const metadata = {
            name: item.name,
            imageUrl: item.url,
            position: item.position,
        };
        if (metadata.imageUrl) {
            result.push({ metadata: profile, imageUrl: profile.imageUrl });
        }
    }
    return result;
}

function getTotalFromResult(data) {
    const total = data?.count;
    return total;
}

test("downloadImagesAndMetadata", async () => {
    const parent = await setupPage();
    const element = getByText(parent, "Website");
    await expect.element(element).toBeInTheDocument();
    // TODO: extract to set up function
    const results = await downloadImagesAndMetadata({
        getImageUrlsAndMetadata,
        getNeededAssetsFromPage,
        getTotalFromResult,
        getUrlAndHeadersFromAssetsAndCounts,
        coolDown: 0,
    });
    expect(results).toBeDefined;
}, 60000);
