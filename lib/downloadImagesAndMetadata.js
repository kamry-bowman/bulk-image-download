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
    downloadLimit = 1000,
    getNeededAssetsFromPage,
    getUrlAndHeadersFromAssetsAndCounts,
    getTotalFromResult,
    getImageUrlsAndMetadata,
    getUpdatedCountFromResult,
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
            console.log(
                `Downloading ${count} of ${total}. Failed tries ${failedTries}`
            );
            const urlAndHeader = getUrlAndHeadersFromAssetsAndCounts(
                neededAssets,
                count
            );
            const data = await fetchDataFromNetwork(urlAndHeader);
            if (data) {
                total = getTotalFromResult(data);
                const imageUrlsAndMetadata = getImageUrlsAndMetadata(data);
                if (total) {
                    let i = 0;
                    for (const { imageUrl, metadata } of imageUrlsAndMetadata) {
                        if (imageUrl) {
                            const imageBlob = await fetchImageFromNetwork({
                                url: imageUrl,
                            });
                            const result = {
                                ...metadata,
                                imageUrl,
                                imageBlob,
                                position: (count || 0) + i++,
                            };
                            results.push(result);
                        }
                    }
                    await new Promise((r) => setTimeout(r, coolDown));
                }
                count = getUpdatedCountFromResult(data);
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
