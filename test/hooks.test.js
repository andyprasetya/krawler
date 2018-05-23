import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import path from 'path'
import fsStore from 'fs-blob-store'
import yaml from 'js-yaml'
import fs from 'fs'
import _ from 'lodash'
import { hooks as pluginHooks } from '../src'

describe('krawler:hooks', () => {
  let inputStore = fsStore({ path: path.join(__dirname, 'data') })
  let outputStore = fsStore({ path: path.join(__dirname, 'output') })

  before(() => {
    chailint(chai, util)
  })

  it('registers custom hook', () => {
    let hookFunction = (hook) => hook
    pluginHooks.registerHook('custom', (options) => hookFunction)
    let hooks = {
      before: {
        custom: { parameter: 1 }
      },
      after: {
        custom: { parameter: 2 }
      }
    }
    hooks = pluginHooks.activateHooks(hooks)
    expect(hooks.before.create.includes(hookFunction)).beTrue()
    expect(hooks.after.create.includes(hookFunction)).beTrue()
  })

  it('manages auth on requests', () => {
    let authHook = {
      type: 'before',
      data: {
        options: {
          auth: {
            user: 'toto',
            password: 'titi'
          }
        }
      }
    }

    pluginHooks.basicAuth({ type: 'Proxy-Authorization' })(authHook)
    expect(authHook.data.options.headers['Proxy-Authorization']).toExist()
    expect(authHook.data.options.headers['Proxy-Authorization'].startsWith('Basic ')).beTrue()
  })

  function checkJson (hook) {
    // We know we have a max value at 73.44 in this file
    expect(hook.result.data).toExist()
    let maxPixel, maxIndex
    let index = 0
    hook.result.data.forEach(pixel => {
      if (pixel.value > 73) {
        maxPixel = pixel
        maxIndex = index
      }
      index++
    })
    expect(maxPixel).toExist()
    // This point [139.736316,35.630105] should be in pixel
    expect(maxPixel.bbox[0] < 139.736316).to.beTrue()
    expect(maxPixel.bbox[2] > 139.736316).to.beTrue()
    expect(maxPixel.bbox[1] < 35.630105).to.beTrue()
    expect(maxPixel.bbox[3] > 35.630105).to.beTrue()
    // It is located at [96, 16]
    expect(Math.floor(maxIndex / 300)).to.equal(16)
    expect(maxIndex % 300).to.equal(96)
  }

  let geotiffHook = {
    type: 'after',
    data: {
      id: 'RJTT-30-18000-2-1.tif'
    },
    result: {
      id: 'RJTT-30-18000-2-1.tif'
    },
    params: { store: inputStore }
  }

  it('converts GeoTiff to JSON', () => {
    return pluginHooks.readGeoTiff({
      fields: ['bbox', 'value']
    })(geotiffHook)
    .then(hook => {
      checkJson(hook)
    })
  })
  // Let enough time to proceed
  .timeout(5000)

  it('computes statistics on GeoTiff', () => {
    return pluginHooks.computeStatistics({
      min: true, max: true
    })(geotiffHook)
    .then(hook => {
      // We know we have a max value at 73.44 in this file
      expect(hook.result.min).toExist()
      expect(hook.result.max).toExist()
      expect(hook.result.min.toFixed(2)).to.equal('-32.00')
      expect(hook.result.max.toFixed(2)).to.equal('73.44')
    })
  })
  // Let enough time to proceed
  .timeout(5000)

  it('write JSON', () => {
    // Switch to output store
    geotiffHook.params.store = outputStore
    return pluginHooks.writeJson()(geotiffHook)
    .then(hook => {
      expect(fs.existsSync(path.join(outputStore.path, geotiffHook.result.id + '.json'))).beTrue()
    })
  })
  // Let enough time to proceed
  .timeout(5000)

  it('clear JSON data', () => {
    pluginHooks.clearData()(geotiffHook)
    expect(geotiffHook.result.data).beUndefined()
  })

  it('read JSON', () => {
    // Update input file name to converted json
    geotiffHook.result.id += '.json'
    return pluginHooks.readJson()(geotiffHook)
    .then(hook => {
      checkJson(hook)
    })
  })
  // Let enough time to proceed
  .timeout(5000)

  it('clear JSON output', () => {
    pluginHooks.clearOutputs()(geotiffHook)
    expect(fs.existsSync(path.join(outputStore.path, geotiffHook.result.id + '.json'))).beFalse()
  })

  let jsonHook = {
    type: 'after',
    result: {
      id: 'json',
      data: {
        first: {
          speed: 10,
          nested: {
            value: 20
          },
          notPicked: 'first',
          omitted: 'first'
        },
        second: {
          speed: 30,
          nested: {
            value: 40
          },
          notPicked: 'second',
          omitted: 'second'
        }
      }
    }
  }

  it('transform JSON', () => {
    pluginHooks.transformJson({
      toArray: true,
      mapping: {
        'nested.value': 'value'
      },
      unitMapping: {
        speed: { from: 'kts', to: 'm/s' }
      },
      pick: ['speed', 'value', 'omit'],
      omit: ['omit'],
      merge: { new: 'new' }
    })(jsonHook)
    expect(Array.isArray(jsonHook.result.data)).beTrue()
    expect(jsonHook.result.data.length === 2).beTrue()
    const data = jsonHook.result.data[0]
    expect(data.notPicked).beUndefined()
    expect(data.omitted).beUndefined()
    expect(data.new).toExist()
    expect(data.new).to.equal('new')
    expect(data.value).toExist()
    expect(data.value).to.equal(20)
    expect(data.speed).to.equal(10 * 0.514444)
  })

  let csvHook = {
    type: 'after',
    data: {
      id: 'RJTT-30-18000-2-1.csv'
    },
    result: {
      id: 'RJTT-30-18000-2-1.csv'
    },
    params: { store: inputStore }
  }

  it('converts CSV to JSON', () => {
    return pluginHooks.readCSV({ headers: true })(csvHook)
    .then(hook => {
      pluginHooks.transformJson({
        mapping: {
          Lonmin: 'bbox[0]',
          Latmin: 'bbox[1]',
          Lonmax: 'bbox[2]',
          Latmax: 'bbox[3]',
          Elev: 'value'
        }
      })(hook)
      checkJson(hook)
    })
  })
  // Let enough time to proceed
  .timeout(5000)

  it('converts JSON to CSV', () => {
    return pluginHooks.readCSV({ headers: true })(csvHook)
    .then(hook => {
      // Switch to output store
      csvHook.params.store = outputStore
      return pluginHooks.writeCSV({ fields: ['Latmin', 'Lonmin', 'Latmax', 'Lonmax', 'Elev'] })(csvHook)
    })
    .then(hook => {
      expect(fs.existsSync(path.join(outputStore.path, csvHook.result.id + '.csv'))).beTrue()
    })
  })
  // Let enough time to proceed
  .timeout(5000)

  let xmlHook = {
    type: 'after',
    data: {
      id: 'wms.xml'
    },
    result: {
      id: 'wms.xml'
    },
    params: { store: inputStore }
  }

  it('converts XML to JSON', () => {
    return pluginHooks.readXML()(xmlHook)
    .then(hook => {
      expect(hook.result.data).toExist()
    })
  })
  // Let enough time to proceed
  .timeout(5000)

  let yamlHook = {
    type: 'after',
    data: {
      id: 'mapproxy.yaml'
    },
    result: {
      id: 'mapproxy.yaml'
    },
    params: { store: inputStore }
  }

  it('converts YAML to JSON', () => {
    return pluginHooks.readYAML()(yamlHook)
    .then(hook => {
      expect(hook.result.data).toExist()
    })
  })
  // Let enough time to proceed
  .timeout(5000)

  it('converts JSON to YAML', () => {
    // Switch to output store
    yamlHook.params.store = outputStore
    return pluginHooks.writeYAML()(yamlHook)
    .then(hook => {
      expect(fs.existsSync(path.join(outputStore.path, yamlHook.result.id + '.yaml'))).beTrue()
    })
  })
  // Let enough time to proceed
  .timeout(5000)

  let capabilitiesHook = {
    type: 'after'
  }

  it('get WMS capabilities', () => {
    return pluginHooks.getCapabilities({
      url: 'http://geoserver.kalisio.xyz/geoserver/Kalisio/wms',
      service: 'WMS'
    })(capabilitiesHook)
    .then(hook => {
      expect(hook.result.data).toExist()
    })
  })
  // Let enough time to proceed
  .timeout(5000)

  let templateHook = {
    type: 'after',
    data: {
      id: 'mapproxy-templated'
    },
    result: {
      id: 'mapproxy-templated',
      data: {
        times: [new Date(Date.UTC(2017, 11, 5, 0, 0, 0)), new Date(Date.UTC(2017, 11, 5, 6, 0, 0)), new Date(Date.UTC(2017, 11, 5, 12, 0, 0))],
        elevations: [0, 10, 100]
      }
    },
    params: { store: outputStore, templateStore: inputStore }
  }

  it('write template from JSON', () => {
    return pluginHooks.writeTemplate({ templateFile: 'mapproxy-template.yaml' })(templateHook)
    .then(hook => {
      let templated = fs.readFileSync(path.join(outputStore.path, 'mapproxy-templated.yaml'), 'utf8')
      templated = yaml.safeLoad(templated)
      let times = _.get(templated, 'layers[0].dimensions.time.values')
      expect(times).toExist()
      expect(times.map(time => new Date(time))).to.deep.equal(hook.result.data.times)
      let elevations = _.get(templated, 'layers[0].dimensions.elevation.values')
      expect(elevations).toExist()
      expect(elevations).to.deep.equal(hook.result.data.elevations)
    })
  })
  // Let enough time to proceed
  .timeout(5000)
})
