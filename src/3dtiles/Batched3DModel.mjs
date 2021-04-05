import BatchTable from './BatchTable.mjs'
import createB3dm from './createB3dm.mjs'
import Cesium from 'cesium'

/**
 * @see https://github.com/AnalyticalGraphicsInc/3d-tiles/blob/master/TileFormats/Batched3DModel/README.md
 */
class Batched3DModel {
  /**
   * @param {Buffer} gltf
   * @param {BatchTable} batchTable
   * @param {BoundingBox} boundingBox
   */
  constructor (gltf, batchTable, boundingBox) {
    this.gltf = gltf
    this.batchTable = batchTable
    this.boundingBox = boundingBox
  }

  /**
   * @returns {Buffer}
   */
  async getBuffer () {
    return await createB3dm({
      glb: this.gltf,
      featureTableJson: {BATCH_LENGTH: this.batchTable.getLength()},
      batchTableJson: this.batchTable.getBatchTableJson()
    })
  }

  /**
   * @returns {Number[]}
   */
  getBox () {
    let points = this.boundingBox.getPoints()
    let zz = [points[0].z, points[1].z]
    let z = Math.max(...zz) - Math.min(...zz)
    points = this.boundingBox.getPoints().map(point => {
      return Cesium.Cartographic.fromCartesian(point)
    })
    let xx = [points[0].longitude, points[1].longitude]
    let yy = [points[0].latitude, points[1].latitude]
    let x = Math.max(...xx) - Math.min(...xx)
    let y = Math.max(...yy) - Math.min(...yy)
    return [
      Math.min(...xx)+x/2,
      Math.min(...yy)+y/2,
      0.0,
      x/2,
      0.0,
      0.0,
      0.0,
      y/2,
      0.0,
      0.0,
      0.0,
      z/2
    ]
  }
  /**
   * @returns {Number[]}
   */
  getRegion () {
    let points = this.boundingBox.getPoints().map(point => {
      return Cesium.Cartographic.fromCartesian(point)
    })
    let longitudes = [points[0].longitude, points[1].longitude]
    let latitudes = [points[0].latitude, points[1].latitude]
    let heights = [points[0].height, points[1].height]
    return [
      Math.min(...longitudes), //west
      Math.min(...latitudes), // south
      Math.max(...longitudes), // east
      Math.max(...latitudes), // north
      Math.min(...heights), // bottom
      Math.max(...heights), // top
    ]
  }

  /**
   * @returns {BatchTable}
   */
  getBatchTable () {
    return this.batchTable
  }
}

export default Batched3DModel
