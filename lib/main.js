import { downloadImagesAndMetadata } from "./downloadImagesAndMetadata.js";
import { addModal } from "./addModal.js";

/**
 * These are assets from the page that can be used in constructing the url
 * where we request image search data. An example could be path information or headers.
 * @typedef {Object} NeededPageAssets
 *
 *
 * A callback to extract assets from the page we will use in constructing the url and headers when
 * we request image data in a loop. These are ordered initially, so as to avoid extracting repeatedly.
 * @typedef {function} getNeededAssetsFromPage
 * @returns {NeededPageAssets}
 *
 * Takes as an argument the object returned from getNeededAssetsFromPage, as well as the
 * current count. The idea is this can construct a new url using the count for the offset as we proceed through
 * the search.
 * @typedef {function} getUrlAndHeadersFromAssetsAndCounts
 * @param {NeededPageAssets} neededPageAssets
 * @returns {Object} returns an object with a url string and headers object property
 *
 * Takes in the result from the image data request, and extracts the total result amount, to be used when looping.
 * @typedef {function} getTotalFromResult
 * @param {Object} result The result we received from the image data url request
 * @returns {number} The total number of images available at the search url if we continue searching
 *
 * Takes in the result from the image data request, and extracts the received count, to be used when looping. We will continue looping
 * until the count is equal to the total.
 * @typedef {function} getTotalFromResult
 * @param {Object} result The result we received from the image data url request
 * @returns {number} The total number of images available at the search url if we continue searching
 *
 * @typedef {Object} ImageUrlAndMetadata
 * @property {Object} metadata an object containing metadata about a given image, to be included in the JSON included in the zip file
 * @property {string} imageUrl the url where we will download this particular image
 *
 * Takes in the result from the image data request, and extracts the total result amount, to be used when looping.
 * @typedef {function} getImageUrlsAndMetadata
 * @param {Object} result The result we received from the image data url request
 * @returns {Array.<ImageUrlAndMetadata>} imageUrlsAndMetadata An array of imageUrls and associated metadata that we will download.
 *
 *
 *
 *
 * Main function and export. This requires callbacks, and will then find a url from the page to request a list of images and associated metadata. It will then
 * move through the offset, downloading all images and finally combining the images and JSON file of associated metadata into a zip folder.
 * @param {number} coolDown how long to wait between requests, to avoid getting rate limited / being a bad citizen
 * @param {number} downloadLimit the maximum amount of images we want to download
 * @param {getNeededAssetsFromPage} getNeededAssetsFromPage
 * @param {getUrlAndHeadersFromAssetsAndCounts} getUrlAndHeadersFromAssetsAndCounts
 * @param {getTotalFromResult} getTotalFromResult
 * @param {getImageUrlsAndMetadata} getImageUrlsAndMetadata
 */
export async function bulkImageDownload({
    coolDown = 100,
    downloadLimit,
    getNeededAssetsFromPage,
    getUrlAndHeadersFromAssetsAndCounts,
    getTotalFromResult,
    getImageUrlsAndMetadata,
    getUpdatedCountFromResult,
}) {
    console.log("Running bulk-image-download");
    const results = await downloadImagesAndMetadata({
        coolDown,
        downloadLimit,
        getImageUrlsAndMetadata,
        getNeededAssetsFromPage,
        getTotalFromResult,
        getUrlAndHeadersFromAssetsAndCounts,
        getUpdatedCountFromResult,
    });
    if (results) {
        console.log(`Finished downloading ${results.length} images.`);
        addModal(results);
    } else {
        console.log("Could not load images. Operation failed.");
    }
}
