<a name="getImageUrlsAndMetadata"></a>

## getImageUrlsAndMetadata ⇒ <code>NeededPageAssets</code> \| <code>Object</code> \| <code>number</code> \| <code>Array.&lt;ImageUrlAndMetadata&gt;</code>

These are assets from the page that can be used in constructing the url
where we request image search data. An example could be path information or headers.

**Kind**: global typedef  
**Returns**: <code>NeededPageAssets</code> - Takes as an argument the object returned from getNeededAssetsFromPage, as well as the
current count. The idea is this can construct a new url using the count for the offset as we proceed through
the search.<code>Object</code> - returns an object with a url string and headers object property

Takes in the result from the image data request, and extracts the total result amount, to be used when looping.<code>number</code> - The total number of images available at the search url if we continue searching<code>Array.&lt;ImageUrlAndMetadata&gt;</code> - imageUrlsAndMetadata An array of imageUrls and associated metadata that we will download.

This function takes callbacks, and will then find a url from the page to request a list of images and associated metadata. It will then
move through the offset, downloading all images and finally combining the images and JSON file of associated metadata into a zip folder.

| Param            | Type                          | Description                                            |
| ---------------- | ----------------------------- | ------------------------------------------------------ |
| neededPageAssets | <code>NeededPageAssets</code> |                                                        |
| result           | <code>Object</code>           | The result we received from the image data url request |
| result           | <code>Object</code>           | The result we received from the image data url request |

**Properties**

| Name     | Type                | Description                                                                                                                                                          |
| -------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| metadata | <code>Object</code> | an object containing metadata about a given image, to be included in the JSON included in the zip file                                                               |
| imageUrl | <code>string</code> | the url where we will download this particular image Takes in the result from the image data request, and extracts the total result amount, to be used when looping. |
