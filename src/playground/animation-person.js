import * as core from '@core'

const appElement = document.getElementById('app')
const baseScene = core.BaseScene.get()

const gt = new core.TextureLoader().load('./src/playground/textures/grass.jpg')
const gg = new core.PlaneBufferGeometry(500, 500)
const gm = new core.MeshPhongMaterial({ color: 0xffffff, map: gt })
const ground = new core.Mesh(gg, gm)
ground.rotation.x = - Math.PI / 2
ground.material.map.repeat.set(30, 30)
ground.material.map.wrapS = ground.material.map.wrapT = core.RepeatWrapping
ground.receiveShadow = true
baseScene.add(ground)

const loader = new core.GLTFLoader()
loader.load('./src/playground/models/Soldier.glb', (gltf) => {

  const light = new core.BaseSceneLight()

  light
    .enableDirectionalLight()
    .enableHemisphereLight()

  const person = new core.GLTFAnimationPerson(gltf)
  person
    .castShadow(true)
    .skeletonHelper(true)
    .walk()

  const mapControls = new core.BaseSceneMapControls(baseScene)

  baseScene
    .add(light)
    .add(person.model)
    .add(person.skeleton)
    .onAnimate((delta) => {
      person.animate(delta)
      mapControls.update()
    })
    .prepareRenderer()
    .prepareCamera()
    .prepareScene()
    .append(appElement)
    .animate()
})

window.addEventListener('resize', () => {
  baseScene.onResize()
}, false)