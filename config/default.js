'use strict';

module.exports = {
    EU4_PATH: 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Europa Universalis IV',

    map: {
        width: 640,

        climate: 'map/climate.txt',
        countries: 'common/country_tags/00_countries.txt',
        definition: 'map/definition.csv',
        history: 'history/provinces',
        provinces: 'map/provinces.bmp',

        colors: {
            sea: {red: 90, green: 90, blue: 220},
            wasteland: {red: 180, green: 180, blue: 180},
            overrides: {
                'NAT': {red: 220, green: 220, blue: 220}
            }
        }
    },

    video: {
        framesPerPart: 250,
        outputPath: function (index) {
            return 'out/video' + index;
        },
        options: function (mapWidth) {
            return {
                fps: 15,
                loop: 1,
                transition: false,
                videoBitrate: 512,
                videoCodec: 'mpeg4',
                size: mapWidth + 'x?',
                format: 'mp4'
            };
        }
    }
};
