#!/usr/bin/env node

import caporal from 'caporal'
import Converter from '../src/Converter.mjs'
import fs from 'fs'

caporal
  .argument('<input-citygml>', 'Input path of CityGML XML file, or folder with multiple files', (path) => {
    if (!fs.existsSync(path)) {
      throw new Error('File does not exist: ' + path)
    }
    return path
  })
  .argument('<output-3dtiles>', 'Output folder where to create 3D-Tiles')
  .action(async function (args, options, logger) {
    let converter = new Converter({
      srsProjections: {
        'http://www.opengis.net/def/crs/EPSG/0/6697': '+proj=longlat +ellps=GRS80 +no_defs'
      }
  })
    logger.info('Converting...')
    await converter.convertFiles(args['inputCitygml'], args['output3Dtiles'])
    logger.info('Done.')
  })

caporal.parse(process.argv)
