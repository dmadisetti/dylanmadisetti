(function() {

    window.requestAnimationFrame = function(callback, element) {
        return window.setTimeout(function() {
            callback();
        }, 5);
    };

    //------------------------------
    // Mesh Properties
    //------------------------------
    var MESH = {
        width: 1.2,
        height: 1.2,
        depth: 10,
        segments: 16,
        slices: 8,
        xRange: 0.8,
        yRange: 0.1,
        zRange: 1.0,
        ambient: '#555555',
        diffuse: '#FFFFFF',
        speed: 0.002
    };

    //------------------------------
    // Light Properties
    //------------------------------
    var LIGHT = {
        count: 2,
        xyScalar: 1,
        zOffset: 100,
        ambient: '#676767',
        diffuse: '#3a3a3a',
        speed: 0.001,
        gravity: 1200,
        dampening: 0.95,
        minLimit: 10,
        maxLimit: null,
        minDistance: 20,
        maxDistance: 400,
        autopilot: false,
        draw: true,
        bounds: FSS.Vector3.create(),
        step: FSS.Vector3.create(
            Math.randomInRange(0.2, 1.0),
            Math.randomInRange(0.2, 1.0),
            Math.randomInRange(0.2, 1.0)
        )
    };

    //------------------------------
    // Render Properties
    //------------------------------
    var CANVAS = 'canvas';
    var RENDER = {
        renderer: CANVAS
    };

    //------------------------------
    // Export Properties
    //------------------------------
    var EXPORT = {
        width: 2000,
        height: 1000,
        drawLights: false,
        minLightX: 0.4,
        maxLightX: 0.6,
        minLightY: 0.2,
        maxLightY: 0.4,
        export: function() {
            var l, x, y, light,
                depth = MESH.depth,
                zOffset = LIGHT.zOffset,
                autopilot = LIGHT.autopilot,
                scalar = this.width / renderer.width;

            LIGHT.autopilot = true;
            LIGHT.draw = this.drawLights;
            LIGHT.zOffset *= scalar;
            MESH.depth *= scalar;

            resize(this.width, this.height);

            for (l = scene.lights.length - 1; l >= 0; l--) {
                light = scene.lights[l];
                x = Math.randomInRange(this.width * this.minLightX, this.width * this.maxLightX);
                y = Math.randomInRange(this.height * this.minLightY, this.height * this.maxLightY);
                FSS.Vector3.set(light.position, x, this.height - y, this.lightZ);
                FSS.Vector3.subtract(light.position, center);
            }

            update();
            render();

            window.open(canvasRenderer.element.toDataURL(), '_blank');

            LIGHT.draw = true;
            LIGHT.autopilot = autopilot;
            LIGHT.zOffset = zOffset;
            MESH.depth = depth;

            resize(container.offsetWidth, container.offsetHeight);
        }
    };

    //------------------------------
    // Global Properties
    //------------------------------
    var now, start = Date.now();
    var old = 0;
    var center = FSS.Vector3.create();
    var attractor = FSS.Vector3.create();
    var container = document.body;
    var renderer, scene, mesh, geometry, material;
    var webglRenderer, canvasRenderer, svgRenderer;
    var gui, autopilotController;

    //------------------------------
    // Methods
    //------------------------------
    function initialise() {
        createRenderer();
        createScene();
        createMesh();
        createLights();
        addEventListeners();
        resize(container.offsetWidth, container.offsetHeight);
        animate();
    }

    function createRenderer() {
        canvasRenderer = new FSS.CanvasRenderer();
        renderer = canvasRenderer;
        renderer.element.id = 'background';
        container.appendChild(renderer.element);
    }

    function createScene() {
        scene = new FSS.Scene();
    }

    function createMesh() {
        scene.remove(mesh);
        renderer.clear();
        geometry = new FSS.Plane(MESH.width * renderer.width, MESH.height * renderer.height, MESH.segments, MESH.slices);
        material = new FSS.Material(MESH.ambient, MESH.diffuse);
        mesh = new FSS.Mesh(geometry, material);
        scene.add(mesh);

        // Augment vertices for animation
        var v, vertex;
        for (v = geometry.vertices.length - 1; v >= 0; v--) {
            vertex = geometry.vertices[v];
            vertex.anchor = FSS.Vector3.clone(vertex.position);
            vertex.step = FSS.Vector3.create(
                Math.randomInRange(0.2, 1.0),
                Math.randomInRange(0.2, 1.0),
                Math.randomInRange(0.2, 1.0)
            );
            vertex.time = Math.randomInRange(0, Math.PIM2);
        }
    }

    function createLights() {
        var l, light;
        for (l = scene.lights.length - 1; l >= 0; l--) {
            light = scene.lights[l];
            scene.remove(light);
        }
        renderer.clear();
        for (l = 0; l < LIGHT.count; l++) {
            light = new FSS.Light(LIGHT.ambient, LIGHT.diffuse);
            light.ambientHex = light.ambient.format();
            light.diffuseHex = light.diffuse.format();
            scene.add(light);

            // Augment light for animation
            light.mass = Math.randomInRange(0.5, 1);
            light.velocity = FSS.Vector3.create();
            light.acceleration = FSS.Vector3.create();
            light.force = FSS.Vector3.create();
        }
    }

    function resize(width, height) {
        renderer.setSize(width, height);
        FSS.Vector3.set(center, renderer.halfWidth, renderer.halfHeight);
        createMesh();
    }

    function animate() {
        now = 25 + (document.documentElement && document.documentElement.scrollTop || document.body && document.body.scrollTop || 0);
        if (now != old) {
            update();
            render();
            //requestAnimationFrame(animate);
        }
    }

    function update() {
        var ox, oy, oz, l, light, v, vertex, offset = MESH.depth / 2;

        var random = 0.1;

        // Animate Vertices
        for (v = geometry.vertices.length - 1; v >= 0; v--) {
            vertex = geometry.vertices[v];
            ox = Math.sin(vertex.time + vertex.step[0] * 25 * MESH.speed);
            oy = Math.cos(vertex.time + vertex.step[1] * 25 * MESH.speed);
            oz = Math.sin(vertex.time + vertex.step[2] * 25 * MESH.speed);
            FSS.Vector3.set(vertex.position,
                MESH.xRange * geometry.segmentWidth * ox,
                MESH.yRange * geometry.sliceHeight * oy,
                MESH.zRange * offset * oz - offset);
            FSS.Vector3.add(vertex.position, vertex.anchor);
            vertex.time += random;
        }
        old = now;

        // Set the Geometry to dirty
        geometry.dirty = true;
    }

    function render() {
        renderer.render(scene);
    }

    function addEventListeners() {
        window.addEventListener('resize', onWindowResize);
        window.addEventListener('scroll', animate);
    }


    //------------------------------
    // Callbacks
    //------------------------------
    function onWindowResize(event) {
        resize(container.offsetWidth, container.offsetHeight);
        render();
    }

    // Let there be light!
    initialise();

})();

(function() {

    var sliders = document.getElementsByClassName("slide");

    Move = function(slider) {
        this.slider = slider;
        this.step = -20;
        this.position = 0;
    }
    Move.prototype.a = -0.4;
    Move.prototype.b = 8;
    Move.prototype.c = 180;
    Move.prototype.root = 20;

    animate = function(move) {
        var speed = (function(x) {
            return move.a * x * x + move.b * x + move.c
        })(move.step++);
        var end = move.step == move.root;

        console.log((end ? move.c : speed) + "px");
        move.slider.style.bottom = (end ? move.c : speed) + "px"

        if (!end) {
            window.setTimeout((function(move) {
                return function() {
                    animate(move)
                }
            })(move), 8);
        }
    };

    initialise = function() {
        for (var i = sliders.length - 1; i >= 0; i--) {
            window.setTimeout((function(move) {
                return function() {
                    animate(move)
                }
            })(new Move(sliders[i])), i * 100);
        };
    }

    // Let there be movement!
    initialise();

})();