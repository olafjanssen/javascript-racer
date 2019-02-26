
/**
 * name: brain-agent
 *
 * Full control agent: takes its x position on the road and its own speed as input and allows left, neutral and right with full throttle, neutral and braking.
 * Reward is speed of car.
 *
 * Bigger brain to compensate for more output nodes.
 *
 * Only is active every 6 frames, which means action and reward is taken across 100ms.
 */

var Agent = function (environment) {
    var tick = 0;
    var episode = 0;
    var maxEpisodes = 20;
    var stats = [];
    var interval = 6;
    var temp_rate = 0.75;

    var training = [];

    this.update = function () {
        environment.update();

        if (tick % interval === 0) {
            // activate the neural network
            training.push(environment.getState());
        }
        tick++;
    };

    this.episodeEnd = function () {
        downloadObjectAsJson(training, environment.getName() + '_training_set');

        episode++;
        if (episode === maxEpisodes) {
            console.log('end!!!');
            environment.end();
            downloadObjectAsJson(stats, environment.getName() + '_episode_stats');
            downloadObjectAsJson(training, environment.getName() + '_training_set');
        }
    };

};

function downloadObjectAsJson(exportObj, exportName) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

var Environment = function (game) {
    function getName() {
        return "10-interval-temp-cars-loaded";
    }

    function getState() {
        var states = {input: {p: (game.playerX + 2) / 4, s: game.speed / game.maxSpeed}, output: {} };

        var carsahead = !game.cars ? [] : game.cars.filter(function (c) {
            return (c.z > game.position + game.playerZ) && (c.z < game.position + game.playerZ + 10 * segmentLength);
        });

        for (var i = 0; i < 6; i++) {
            var car = carsahead.find(function (c) {
                return (c.offset - game.playerX > -0.75 + i * 0.25) && (c.offset - game.playerX < -0.75 + (i + 1) * 0.25);
            });
            if (car === undefined) {
                states.input['c'+i] = 1;
            } else {
                states.input['c'+i] = (car.z - (game.position + game.playerZ)) / (10 * segmentLength);
            }
        }

        states.output[readAction()] = game.speed/game.maxSpeed;

        return states;
    }


    function update() {
    }

    function readAction() {

        var outState = 'o';
        if (game.keyLeft) {
            outState += 'l';
        }
        if (game.keyRight) {
            outState += 'r';
        }
        if (game.keyFaster) {
            outState += 'f';
        }
        if (game.keySlower) {
            outState += 's';
        }

        return outState;
    }

    function end() {
        capturer.stop();
        capturer.save();
    }

    return {
        getState: getState,
        update: update,
        end: end,
        getName: getName
    }
};

var environment = new Environment(window);
var agent = new Agent(environment);

// var capturer = new CCapture({format: 'webm', framerate: 60, name: environment.getName(), verbose: true});
//
// function render() {
//     requestAnimationFrame(render);
//     capturer.capture(canvas);
// }
//
// setTimeout(function () {
//     capturer.start();
//     render();
// }, 1000);
