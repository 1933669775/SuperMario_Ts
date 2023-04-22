/**
 * 游戏的关卡信息
 */

import Store from "../store/Store";
import {Map_back, RenderMapData} from './map-d'
import enemyPlant from "../enemy/EnemyPlant";
import Player from "../protagonist/Player";

class Map {
  // 要渲染的数据
  renderMapData: RenderMapData[]
  // 最大 Y 边界值
  boundaryY: number
  // 最大 Y 边界值
  boundaryX: number
  // 每一个地图上块的宽度
  BASIC_WIDTH: number
  // 每一个地图上块的高度
  BASIC_HEIGHT: number

  constructor() {
    this.renderMapData = []
    this.boundaryY = 0
    this.boundaryX = 0
    this.BASIC_WIDTH = 45
    this.BASIC_HEIGHT = 40
  }

  // 初始化游戏关卡
  init() {
    const { bodyMap } = Store.getCurrentMapInfo
    const { map } = bodyMap
    const { BASIC_WIDTH, BASIC_HEIGHT } = this
    // 计算最大边界的宽和高

    this.boundaryY = map.length * BASIC_HEIGHT;
    this.boundaryX = map[0].length * BASIC_HEIGHT;

    // 1 层
    map.map((v1, i1) => {
      let i2 = -1;
      for (const v2 of v1) {
        i2 ++
        // 空数据没有插入的必要
        if (v2.trim() === '') continue
        const x = i2 * BASIC_WIDTH, y = i1 * BASIC_HEIGHT
        // 将背景和敌人数据分离
        if (Store.backMnum.includes((<Map_back>v2))){
          // 背景 ---------
          this.renderMapData.push({
            x,
            y,
            type: <Map_back>v2
          })
        } else {
          // 敌人 ---------
          enemyPlant[v2 as '@'](x, y)
        }
      }
    })
    // 渲染 ------------
    this.renderMap()
  }

  // 渲染游戏地图
  renderMap() {
    // 要绘制的元素方法，普遍为：[draw-当前的背景类型],如墙是=，那么绘制墙为 draw-=
    this.getMapData.map(v => {
      this[`draw-${<'='>v.type}`] && this[`draw-${<'='>v.type}`](v);
    })
  }

  /**
   * 绘制墙
   * @param rd
   */
  'draw-='(rd: RenderMapData) {
    const { ctx } = Store;
    Store.basicsDraw(() => {
      ctx.fillRect(rd.x, rd.y, (this as Map).BASIC_WIDTH, (this as Map).BASIC_HEIGHT)
    })
  }

  // 获取地图元素数据，只会返回在当前视口内的数据
  get getMapData() {
    return this.renderMapData.filter(v => {
      return Store.hitDetection({
        ...v,
        w: this.BASIC_WIDTH,
        h: this.BASIC_HEIGHT
      }, {
        x: Player.viewportX,
        y: Player.viewportY,
        ...Store.getCanvasInfo
      })
    })
  }
}

export default new Map()
