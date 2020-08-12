/* 
** 
** A* Algorithm visualization
** Currently works only for simple n x n grids
** without obstacles
** 
** Work in progress
*/

// Global classes and variables
class QueueElement {
    constructor(x, y) {
      this.x = x
      this.y = y
      this.gScore = 0
      this.hScore = 0
      this.fScore = 0
      this.parent = null
      this.neighbors = new Set()
    }
    
    addNeighbor(node) {
      this.neighbors.add(node)
    }
    
    getNeighbors() {
      return Array.from(this.neighbors)
    }
    
    equals(element) {
      return this.x == element.x && this.y == element.y
    }
  }
  
  class PriorityQueue {
    constructor() {
      this.items = []
    }
    
    getQueue() {
      if (this.isEmpty()) {
        return []
      }
      return this.items
    }
    
    enqueue(element) {
      let contains = false
      
      for (let i = 0; i < this.items.length; i++) {      
        if (this.items[i].fScore > element.fScore) {
          this.items.splice(i, 0, element)
          contains = true
          break
        }
      }
      
      if (!contains) {
        this.items.push(element)
      }
    }
    
    dequeue() {
      if (this.isEmpty()) {
        return []
      }
      return this.items.shift()
    }
    
    // For getting start and goals nodes with distance and neighbors
    getByCoordinates(x, y) {
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].x == x && this.items[i].y == y) {
          return this.items[i]
        }
      }
    }
    
    first() {
      if (this.isEmpty()) {
        return []
      }
      return this.items[0]
    }
    
    rear() {
      if (this.isEmpty()) {
        return []
      }
      return this.items[this.items.length - 1]
    }
    
    isEmpty() {
      return this.items.length == 0
    }
    
    clear() {
      this.items = []
    }
    
    printQueue() {
      let str = ""
      this.items.map(obj => str += obj.element + " ")
      return str
    } 
  }
  
  let n = 30
  let visited
  let start, goal
  
  // Heuristics functions
  function getEuclideanDistance(current, target) {
    return Math.sqrt(Math.pow(current.x - target.x, 2) + Math.pow(current.y - target.y, 2))  
  }
  
  function getManhattanDistance(current, target) {
    return Math.abs(current.x - target.x) + Math.abs(current.y - target.y)
  }
  
  // A* algorithm
  function aStar(start, goal) {
    const queue = new PriorityQueue()
    queue.enqueue(start)
    
    while (!queue.isEmpty()) {
      const node = queue.first()
      queue.dequeue()
              
      if (!visited.has(node)) {
        visited.add(node)      
        
        if (node.equals(goal)) {
          return node
        }
        
        const neighbors = node.getNeighbors()
        
        for (let i = 0; i < neighbors.length; i++) {
          
          const n = neighbors[i]
          
          const gScore = node.gScore + getEuclideanDistance(n, node)
          const hScore = getEuclideanDistance(n, goal)
          const fScore = gScore + hScore
          
          if (n.fScore != 0 && n.fScore < fScore) {
            continue
          }
          
          n.gScore = gScore
          n.hScore = hScore
          n.fScore = fScore        
          n.parent = node        
          
          queue.enqueue(n)             
        }                    
      }
    }  
    return null
  }
  
  function reversePath(path) {
    const reversedPath = []
    
    for (let i = path.length - 1; i >= 0; i--) {
      reversedPath.push(path[i])
    }
    
    return reversedPath
  }
  
  function reconstructPath(start, goal) {
    const path = []
    let currentNode = goal
    
    if (currentNode == null) return []    
    
    while (!currentNode.equals(start)) {
      path.push(currentNode)
      currentNode = currentNode.parent  
    }
    
    path.push(start)
    
    return reversePath(path)
  }
  
  function findNeighbors(grid, n) {  
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (j > 0) {
          grid[i][j].addNeighbor(grid[i][j - 1])
          
          if (i > 0) {
            grid[i][j].addNeighbor(grid[i - 1][j - 1])
          } 
          if (i < n - 1) {
            grid[i][j].addNeighbor(grid[i + 1][j - 1])
          }
        } 
        
        if (j < n - 1) {
          grid[i][j].addNeighbor(grid[i][j + 1])
          if (i > 0) {
              grid[i][j].addNeighbor(grid[i - 1][j + 1])
          } 
          if (i < n - 1) {
            grid[i][j].addNeighbor(grid[i + 1][j + 1])
          }
        } 
        
        if (i > 0) {
          grid[i][j].addNeighbor(grid[i - 1][j])
        } 
        
        if (i < n - 1) {
          grid[i][j].addNeighbor(grid[i + 1][j])
        }
      }
    }
    
    return grid
  }
  
  function generateGrid(n) {
    const grid = []
    
    for (let i = 0; i < n; i++) {
      grid[i] = []    
      for (let j = 0; j < n; j++) {
        grid[i][j] = new QueueElement(j, i)                  
      }
    }
    return findNeighbors(grid, n)
  }
  
  // Init canvas and set animation variables
  let animation1, animation2, path, m
  const canvas = document.getElementById("grid")
  const ctx = canvas.getContext("2d")
  const edgeLength = canvas.width
  let timerDivider = n / 10
  pixelSize = edgeLength / n
  colorVisited = "#b8f3f5"
  colorPath = "#32dde3"
  colorGoal = "#e3327c"
  colorGrid = "#c8c8c8d4"
  
  function drawGrid() {
  
   for (let i = 0; i < edgeLength; i += pixelSize) {
     ctx.moveTo(i + pixelSize - 0.5, 0)
     ctx.lineTo(i + pixelSize - 0.5, edgeLength)
   } 
    
   for (let i = 0; i < edgeLength; i += pixelSize) {
     ctx.moveTo(0, i + pixelSize - 0.5)
     ctx.lineTo(edgeLength, i + pixelSize - 0.5)
   } 
    
   ctx.strokeStyle = colorGrid
   ctx.stroke()
  } drawGrid()
  
  function getPixelInfo(node) {
    return obj = {
      nodeX: node.x * pixelSize,
      nodeY: node.y * pixelSize,
      width: pixelSize - 1,
      height: pixelSize - 1
    }
  }
  
  function visitedAnimation() { 
    ctx.fillStyle = colorVisited
    const node = visited[m]
    
    obj = getPixelInfo(node)
    
    ctx.fillRect(obj.nodeX, obj.nodeY, obj.width, obj.height) 
    
    if (m == visited.length - 1) {
      clearInterval(animation1)      
      m = -1
      animation2 = setInterval(pathAnimation, 300 / timerDivider)
    }  
    m++
  }
  
  function pathAnimation() {
    const node = path[m]
    
    const obj = getPixelInfo(node)
    
    if (m == 0 || m == path.length - 1) {
      ctx.fillStyle = colorGoal
      ctx.fillRect(obj.nodeX, obj.nodeY, obj.width, obj.height) 
    } else {
      ctx.fillStyle = colorPath
      ctx.fillRect(obj.nodeX, obj.nodeY, obj.width, obj.height) 
    }
    
    if (m == path.length - 1) {
      clearInterval(animation2)      
    }
    m++
  }
  
  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawGrid()
  }
  
  start = new QueueElement(0, 0)
  goal = new QueueElement(n - 1, n - 1)
  
  function runSimulation() {  
    clearCanvas()
    const grid = generateGrid(n)
    visited = new Set()
    result = aStar(grid[start.x][start.y], grid[goal.x][goal.y])
    console.log(result)
    console.log(visited)  
    
    m = 0
    visited = Array.from(visited) == undefined ? [] : Array.from(visited)
    path = reconstructPath(start, result)
    clearInterval(animation1)
    clearInterval(animation2)
    animation1 = setInterval(visitedAnimation, 150 / timerDivider)
  }
  
  // Mouse position on canvas
  class Pixel {
    constructor(startX, startY, endX, endY, x, y) {
      this.startX = startX
      this.startY = startY
      this.endX = endX
      this.endY = endY
      this.x = x
      this.y = y     
    }
  }
  
  function calculateGridMeasures(edgeLenght) {
    const pixels = []
    let x = 0
    let y = 0
    
    for (let i = 0; i < edgeLength; i += pixelSize) {
      arr = []
      for (let j = 0; j < edgeLength; j += pixelSize) {
        arr.push(new Pixel(j, i, j + pixelSize - 1, i + pixelSize - 1, x, y))  
        y++
      }    
      pixels.push(arr)
      y = 0
      x++
    }  
    return pixels
  }
  
  function getMousePosition(canvas, event, grid) {
    let position = canvas.getBoundingClientRect()
    let x = event.clientX - position.left
    let y = event.clientY - position.top
    console.log(grid)
    
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid.length; j++) {
        const pixel = grid[i][j]
        if (x >= pixel.startX && x <= pixel.endX && y >= pixel.startY && y <= pixel.endY) {
          console.log(pixel)        
          goal = new QueueElement(pixel.x, pixel.y)
          // goal = new QueueElement((edgeLength - (edgeLength - pixel.startY)) / pixelSize, (edgeLength - (edgeLength - pixel.startX)) / pixelSize)
          console.log(goal)
          clearCanvas()
          ctx.fillStyle = colorGoal
          ctx.fillRect(pixel.startX, pixel.startY, pixelSize - 1, pixelSize - 1)
        } 
      }
    }
  }
  
  canvas.onmousedown = (event) => getMousePosition(canvas, event, gridMeasures)
  
  let sliderValue = document.getElementById("slider-value")
  
  let gridMeasures = calculateGridMeasures(edgeLength)
  
  const rangeSlider = document.getElementById("slider")
  rangeSlider.oninput = () => {
    n = rangeSlider.value
    sliderValue.innerHTML = n
    pixelSize = edgeLength / n
    timerDivider = n / 10
    goal = new QueueElement(n - 1, n - 1)
    gridMeasures = calculateGridMeasures(edgeLength)
    ctx.beginPath()
    clearCanvas()
    drawGrid()
  }
  
  sliderValue.innerHTML = rangeSlider.value
  
  const runButton = document.getElementById("run")
  runButton.onclick = () => runSimulation()
  