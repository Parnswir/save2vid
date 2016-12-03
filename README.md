# save2vid
A **savegame visualizer** for Paradox Interactive's [Europa Universalis IV](http://www.europauniversalis4.com/) that renders the political map mode over time as a configurable video using *ffmpeg*.

## Setup
* Install [ffmpeg](https://ffmpeg.org/download.html).
* Install a recent [Node.js](https://nodejs.org/).
* `npm install`

## Usage
* Change `config/default.js` to match your game path and output preferences. See [configuration](#configuration) for details.
* `node app.js [path to your uncompressed save file]`

Make sure EU4 is installed in the specified directory and ffmpeg is in your path.

## Compatibility
* Use a recent version of Node.js. Tested with 6.5.0, but should work in older versions.
* Should work with every version of EU4 (last tested with 1.19.)
* Make sure that the save file and the installed EU4 version match (otherwise provinces are not colored correctly)
* Mods that change the map are supported: change the appropriate paths in the [configuration](#configuration).

## Configuration
Change `config/default.js` to match your game path and preferences.

|Key|Description|Options|
|---|---|---|
|EU4_PATH|Absolute path to EU4 directory|Default is Windows x64 Steam directory|
|map.width|Width in pixels of output frames|Integer|
|map.climate, map.countries, map.definition, map.history, map.provinces|Relative path from base directory to data files.|Do not change in unmodded environment!|
|map.colors.sea, map.colors.wasteland|Colors used for oceans and wastelands respectively|Any RGB value in the format `{red: int, green: int, blue: int}`|
|map.colors.overrides|Colors by tag that should be used instead of default colors.|Format: `'TAG': {red: int, green: int, blue: int}`. Use `'NAT'` for Natives/uncolonized provinces.|
|video.framesPerPart|Split video in parts of X frames. By default, save2vid will split the output video into parts of fixed size to prevent a limitation of ffmpeg on Windows.|Integer. Default is 250.|
|video.parallelize|If multiple parts are produced, parallelize their creation. This will use significantly more resources, but reduce the processing time on more powerful systems.|`true` / `false`(default)|
|video.outputPath|Function that will be invoked to generate the name of video parts.|Will be invoked with the part's index as single argument.|
|video.options|Function that will be invoked to determine the options supplied to ffmpeg via [videoshow](https://github.com/h2non/videoshow).|Will be invoked with the map width as single argument. This allows to scale the video accordingly. See [videoshow documentation](https://github.com/h2non/videoshow#video-options) for more options.|
