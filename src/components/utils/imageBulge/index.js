// Test import of a JavaScript module
import Scene from '../imageBulge/components/scene.js'

const getCanvas = document.querySelectorAll('.canvas-container')
  
  getCanvas.forEach((canvas) => {
    new Scene()
    console.log(Scene)
})
