(function conway() {

    // Conway; an implentation for fun
    // 1/6/2015, Dylan Madisetti

    // Just some variables
    var game;
    var canvas = document.getElementById("game");
    var positionLocation;
    var colorLocation;
    var gl;
    var rectangle, color;

    // Helper functions
    var max = function(a,b){if(a>b) return a; return b;}
    var hash = function(value){return value.x+":"+value.y;}
    var reset = function(){
        conway.move = {};
        conway.show = [];
        game = new Game();
    
        /** Acorn **/
        var moves = [{x:23,y:12},
            {x:22,y:14},
            {x:23,y:14},
            {x:25,y:13},
            {x:26,y:14},
            {x:27,y:14},
            {x:28,y:14}];

        /** Glider **/
        // var moves = [{x:1,y:3},
        //    {x:2,y:3},
        //    {x:3,y:3},
        //    {x:3,y:2},
        //    {x:2,y:1}];

        conway.count = moves.length;
    
        for (var i = conway.count - 1; i >= 0; i--) {
            conway.move[hash(moves[i])] = moves[i];
        };
    }

    // Kick it off
    var init = function(){

        // Set up page
        window.onresize = Game.prototype.resize;

        // Vanilla data
        reset();

        if(gl){
            // setup GLSL program
            vertexShader = createShaderFromScriptElement(game.context, "2d-vertex-shader");
            fragmentShader = createShaderFromScriptElement(game.context, "2d-fragment-shader");
            program = createProgram(game.context, [vertexShader, fragmentShader]);
            game.context.useProgram(program);

            // External Vars
            colorLocation = game.context.getUniformLocation(program, "u_color");
            positionLocation = game.context.getAttribLocation(program, "a_position");

            // Create a buffer
            game.context.bindBuffer(game.context.ARRAY_BUFFER, game.context.createBuffer());
            game.context.enableVertexAttribArray(positionLocation);
            game.context.vertexAttribPointer(positionLocation, 2, game.context.FLOAT, false, 0, 0);
        }

        // Let there be movement!
        game.resize();
        game.animate();
    }


    // Wrap it up
    var Game = function(){
        this.processing = false;
    }

    // Game functions alphabetized
    Game.prototype.animate = function(move) {

        // Race conditions will just render previous frame
        game.frame();
        game.compute();

        // Won't actually ever kick off. Yet. Maybe replay?
        if (conway.move == null){

            // Render replay, maybe
            return;
        }

        window.requestTimeout(game.animate, 150);
    };

    // Wipe the board
    Game.prototype.clear = function(){
        color(true);
        rectangle(0, 0, game.width, game.height);
        color(false);
    }

    // Figure out next move
    Game.prototype.compute = function() {
        if(game.processing) return;
        game.processing = true;
        setTimeout(function(){

            // Hash maps for ease
            // Could condense, but less readable 
            // Could potentially use nested trees for numerical look up 
            // x parent tree, y child tree
            // But I'm not goig to build out that functionality for an 
            // interpeted language that may well be slower than a native
            // solution.
            var empties = {};
            var loners  = {};
            var next    = {};
            var dead    = {};
            var count   = 0;

            // Run through each and surrounding
            for (var instance in conway.move) {
                for (var j = -1; j <= 1; j++) {
                    for (var k = -1; k <= 1; k++) {

                        // Set up hash map and object
                        // Initially used JSON.toString,
                        // but this is much faster 
                        // https://jsperf.com/conwaygol
                        var value = {x:conway.move[instance].x + j,
                            y:conway.move[instance].y + k},
                            key   = hash(value);

                        // Kick out if overpopulated
                        if (dead[key]) continue;

                        // If not in current set, check to see if neighbors 
                        // and move to next if good
                        if (conway.move[key] == null){
                            if(empties[key] != null){
                                empties[key].count += 1;
                                if(empties[key].count == 3){
                                    conway.move[key] = value;
                                    next[key] = value;
                                    next[key].count = 3;
                                    count += 1;
                                    delete empties[key];
                                }
                            }else{
                                value.count = 1;
                                empties[key] = value;
                            }

                        // If in current set, make sure not over populated
                        } else if (next[key] != null){
                            next[key].count += 1;
                            if(next[key].count > 3){
                                dead[key] = true;
                                count -= 1;
                                delete next[key];
                            }

                        // Check to see if potentially isolated
                        } else if (loners[key] != null){
                            loners[key].count += 1;
                            if(loners[key].count == 2){
                                count += 1;
                                next[key] = loners[key];
                                delete loners[key];
                            }

                        // Capture pieces not yet associated
                        } else{
                            loners[key]       = value;
                            loners[key].count = 0;
                        }
                    };
                };
            };

            // Set for next render
            conway.move = next;
            conway.count = count;
            game.processing = false;
        },0);
    }

    // Build the frame
    Game.prototype.frame = function(){
        //this.context.save();
        this.clear();
        var i = conway.move.length - 1;
        for (var key in conway.move) {
            this.render(conway.move[key]);
        };
        //this.context.restore();
    }

    // Fills the buffer with the values that define a rectangle.
    Game.prototype.render = function (move) {
        rectangle(game.size * move.x,game.size * move.y, game.size, game.size);
    }

    // Responsive Conway is responsive
    Game.prototype.resize = function(event) {

        // Stop distortion of exisiting resized body
        canvas.setAttribute('height', '0px');
        canvas.setAttribute('width' , '0px');

        // Get body
        game.width  = document.body.scrollWidth;
        game.height = document.body.scrollHeight;
        game.size   = max(game.height,game.width)/30;

        // Set canvas to new body
        canvas.setAttribute('height', game.height + 'px');
        canvas.setAttribute('width', game.width + 'px');

        if(gl){
            // lookup uniforms
            var resolutionLocation = game.context.getUniformLocation(program, "u_resolution");

            // set the resolution
            game.context.uniform2f(resolutionLocation, game.width, game.height);
            game.context.viewport(0, 0, game.context.canvas.width, game.context.canvas.height);
        }

        // Build current frame with specs
        game.frame()
    }

    // Not fully convinced WebGL does a better job than native Canvas
    Game.prototype.context = getWebGLContext(canvas);
    if(!Game.prototype.context){
        gl = false;
        Game.prototype.context = canvas.getContext("2d");
        rectangle = function(x,y,width,height){
            game.context.fillRect(x,y,width,height)
        }

        color = function(dead){
            if(dead) game.context.fillStyle = "#202021";
            else     game.context.fillStyle = "#282827";
        }
    }else{
        gl = true;
        rectangle = function (x,y,width,height) {
            var x1 = x;
            var x2 = x + width;
            var y1 = y;
            var y2 = y + height;
            game.context.bufferData(game.context.ARRAY_BUFFER, new Float32Array([
                x1, y1,
                x2, y1,
                x1, y2,
                x1, y2,
                x2, y1,
                x2, y2]), game.context.STATIC_DRAW);
            game.context.drawArrays(game.context.TRIANGLES, 0, 6);
        }

        color = function(dead){
            // Set a random color.
            if(dead) game.context.uniform4f(colorLocation, 32/300, 32/300, 33/300, 1);
            else     game.context.uniform4f(colorLocation, 40/300, 40/300, 39/300, 1);
        }
    }


    // Let's set this to actually run
    init();
})();