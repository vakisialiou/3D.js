import * as THREE from 'three'
import EventEmitter from 'events'
import CSS2DRenderer from './css-renderer/CSS2DRenderer'
import CSS3DRenderer from './css-renderer/CSS3DRenderer'
import Mouse3D from './mouse/Mouse3D'

let inst = null
const ANIMATION = 'base-scene-animation'

class BaseScene {
  constructor() {
    if (inst) {
      throw Error('BasScene instance has already exists. Try to use static method BaseScene.get()')
    }

    /**
     *
     * @type {HTMLElement|?}
     */
    this.appElement = null

    /**
     *
     * @type {Clock}
     */
    this.clock = new THREE.Clock()

    /**
     *
     * @type {Camera|PerspectiveCamera}
     */
    this.camera = new THREE.PerspectiveCamera()

    /**
     *
     * @type {Scene}
     */
    this.scene = new THREE.Scene()

    /**
     *
     * @type {WebGLRenderer}
     */
    this.renderer = new THREE.WebGLRenderer({ antialias: true })

    /**
     *
     * @type {CSS2DRenderer}
     */
    this.css2DRenderer = new CSS2DRenderer()

    /**
     *
     * @type {CSS3DRenderer}
     */
    this.css3DRenderer = new CSS3DRenderer()

    /**
     *
     * @type {Mouse3D}
     */
    this.mouse = new Mouse3D()

    /**
     *
     * @type {EventEmitter}
     */
    this.animationEvents = new EventEmitter()

    this._options = {
      css2DRendererEnabled: false,
      css3DRendererEnabled: false
    }
  }

  /**
   *
   * @returns {BaseScene}
   */
  static get() {
    return inst || (inst = new BaseScene())
  }

  /**
   *
   * @param {Object3D} object3D
   * @returns {BaseScene}
   */
  add(object3D) {
    this.scene.add(object3D)
    return this
  }

  /**
   * @param {number} delta
   * @callback baseSceneAnimation
   */

  /**
   *
   * @param {baseSceneAnimation} callback
   * @returns {BaseScene}
   */
  onAnimate(callback) {
    this.animationEvents.on(ANIMATION, callback)
    return this
  }

  /**
   *
   * @returns {BaseScene}
   */
  prepareRenderer() {
    const width = window.innerWidth
    const height = window.innerHeight
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.shadowMap.enabled = true
    this.renderer.gammaOutput = true;
    this.renderer.gammaInput = true
    return this
  }

  /**
   *
   * @returns {BaseScene}
   */
  prepareCSS2DRenderer() {
    const width = window.innerWidth
    const height = window.innerHeight
    this.css2DRenderer.setSize(width, height)
    this.css2DRenderer.domElement.style.position = 'absolute'
    this.css2DRenderer.domElement.style.top = 0
    document.body.appendChild(this.css2DRenderer.domElement)
    this._options.css2DRendererEnabled = true
    return this
  }

  /**
   *
   * @returns {BaseScene}
   */
  prepareCSS3DRenderer() {
    const width = window.innerWidth
    const height = window.innerHeight
    this.css3DRenderer.setSize(width, height)
    this.css3DRenderer.domElement.style.position = 'absolute'
    this.css3DRenderer.domElement.style.top = 0
    document.body.appendChild(this.css3DRenderer.domElement)
    this._options.css3DRendererEnabled = true
    return this
  }

  /**
   *
   * @returns {BaseScene}
   */
  prepareCamera() {
    const width = window.innerWidth
    const height = window.innerHeight
    this.camera.fov = 45
    this.camera.aspect = width / height
    this.camera.near = 1
    this.camera.far = 1000
    this.camera.lookAt(0, -4, -10)
    this.camera.position.set(0, 5, 10)
    this.camera.updateProjectionMatrix()
    return this
  }

  /**
   *
   * @returns {BaseScene}
   */
  prepareScene() {
    this.scene.background = new THREE.Color(0xFFFFFF)
    this.scene.fog = new THREE.Fog(0xFFFFFF, 10, 50)
    return this
  }

  /**
   *
   * @param {HTMLElement} appElement
   * @returns {BaseScene}
   */
  append(appElement) {
    this.appElement = appElement
    this.appElement.appendChild(this.renderer.domElement)
    return this
  }

  /**
   *
   * @returns {BaseScene}
   */
  onResize() {
    const width = window.innerWidth
    const height = window.innerHeight
    this.renderer.setSize(width, height)
    this.css2DRenderer.setSize(width, height)
    this.css3DRenderer.setSize(width, height)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    return this
  }

  /**
   *
   * @param {MouseEvent} event
   * @returns {BaseScene}
   */
  onMouseMove(event) {
    event.preventDefault()
    this.mouse.updateMousePosition(event)
    return this
  }

  /**
   *
   * @returns {BaseScene}
   */
  animate() {
    const delta = this.clock.getDelta()
    requestAnimationFrame(() => this.animate())
    this.animationEvents.emit(ANIMATION, delta)
    this.renderer.render(this.scene, this.camera)
    if (this._options.css2DRendererEnabled) {
      this.css2DRenderer.render(this.scene, this.camera)
    }
    if (this._options.css3DRendererEnabled) {
      this.css3DRenderer.render(this.scene, this.camera)
    }
    // this.mouse.intersectObjects(this.camera, this.scene.children, (object) => {
    //   console.log('up', object)
    // }, (object) => {
    //   console.log('down', object)
    // })
    return this
  }

  /**
   *
   * @returns {BaseScene}
   */
  registrationEvents() {
    window.addEventListener('resize', (event) => this.onResize(event), false)
    window.addEventListener('mousemove', (event) => this.onMouseMove(event), false)
    return this
  }
}

export default BaseScene