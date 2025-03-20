# Bulk Image Downloader

The idea here is that if we have a search API that returns image urls, we might want to iterate through all results instead
of manually downloading each one. This is really a convenience utility, and requires callbacks to be passed to extract the
search API's url for each iteration of the search. Currently only offsets, rather than cursors, are supported. See lib/main.js
for specific instructions of how to write the callback functions.

After running `npm install` and `npm run build`, a `dist/bulk-image-download.js` file wiil be created. `bulkImageDownload` is
exported from this module, and must receive an object containing the callbacks described in the function definition of bulkImageDownload
in `lib/main.js`.
