import * as PIXI from 'pixi.js'

let points = [
  [50, 200],
  [100, 400],
  [400, 100],
  [600, 600]
]

const app = new PIXI.Application(window.innerWidth, window.innerHeight, {antialias: true, backgroundColor : 0xFFFFFFf })
document.body.appendChild(app.view)
app.stage.interactive = true

const curve = new PIXI.Graphics()

function drawCurve (points) {
  curve.clear()
  curve.lineStyle(5, 0xC0C0C0, 1)
  curve.moveTo(...points[0])
  for (let t = 0; t < 1; t += 0.005) {
    let point = bezier(t, points)
    curve.lineTo(...point)
  }
}

const drawPoints = points.map(point => {
  const drawPoint = new PIXI.Graphics()
  drawPoint.beginFill(0x000000)
  drawPoint.drawCircle(0, 0, 7)
  drawPoint.endFill()
  drawPoint.x = point[0]
  drawPoint.y = point[1]
  drawPoint.interactive = true
  drawPoint.buttonMode = true
  drawPoint
    .on('pointerdown', onDragStart)
    .on('pointerup', onDragEnd)
    .on('pointerupoutside', onDragEnd)
    .on('pointermove', onDragMove)
  app.stage.addChild(drawPoint)
  return drawPoint
})

drawCurve(points)
app.stage.addChild(curve)

function onDragStart (event) {
  this.data = event.data
  this.alpha = 0.5
  this.dragging = true
}

function onDragEnd () {
  this.alpha = 1
  this.dragging = false
  this.data = null
}

function onDragMove () {
  if (this.dragging) {
    let newPosition = this.data.getLocalPosition(this.parent)
    this.x = newPosition.x
    this.y = newPosition.y
    points = drawPoints.map(drawPoint => [drawPoint.x, drawPoint.y])
    drawCurve(points)
  }
}

function bezier (parameter, points) {
  const order = points.length - 1
  const dimension = points[0].length

  let v = points.map(point => point.slice())

  for (let i = order; i > 0; i--) {
    for (let j = 0; j < order; j++) {
      for (let k = 0; k < dimension; k++) {
        v[j][k] = (1 - parameter) * v[j][k] + parameter * v[j + 1][k]
      }
    }
  }

  return v[0]
}
