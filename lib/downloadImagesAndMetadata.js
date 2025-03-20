async function fetchDataFromNetwork({ url, headers }) {
    let data = null;
    const outerRes = await fetch(url, { headers });

    if (!outerRes.ok) {
        console.error(outerRes.error());
        return;
    }
    data = await outerRes.json();
    return data?.data;
}

async function fetchImageFromNetwork({ url }) {
    try {
        const outerRes = await fetch(url);

        if (!outerRes.ok) {
            console.error(outerRes.error());
            return;
        }
        const imageBlob = await outerRes.blob();
        return imageBlob;
    } catch (err) {
        console.error(err);
    }
}

async function downloadImagesAndMetadata({
    coolDown = 1000,
    downloadLimit = 100,
    getNeededAssetsFromPage,
    getUrlAndHeadersFromAssetsAndCounts,
    getTotalFromResult,
    getImageUrlsAndMetadata,
} = {}) {
    const neededAssets = getNeededAssetsFromPage();
    if (neededAssets) {
        let count = 0;
        let total = null;
        let failedTries = 0;
        let failedTryLimit = 3;
        const results = [];
        while (
            failedTries < failedTryLimit &&
            (total === null || count < Math.min(downloadLimit, total))
        ) {
            const urlAndHeader = getUrlAndHeadersFromAssetsAndCounts(
                neededAssets,
                count
            );
            const data = await fetchDataFromNetwork(urlAndHeader);
            if (data) {
                total = getTotalFromResult(data);
                const imageUrlsAndMetadata = getImageUrlsAndMetadata(data);
                if (total) {
                    for (const { imageUrl, metadata } of imageUrlsAndMetadata) {
                        if (imageUrl) {
                            const imageBlob = await fetchImageFromNetwork({
                                url: imageUrl,
                            });
                            const result = {
                                ...metadata,
                                imageUrl,
                                imageBlob,
                                position:
                                    metadata.position !== undefined
                                        ? metadata.position
                                        : count + 1,
                            };
                            results.push(result);
                            count = metadata.position;
                        }
                    }
                    await new Promise((r) => setTimeout(r, coolDown));
                }
            } else {
                failedTries += 1;
            }
        }
        return results;
    } else {
        console.error("Failed to parse needed assets from page");
    }
}

export { downloadImagesAndMetadata };
