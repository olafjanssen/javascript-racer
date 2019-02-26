/**
 * name: 01-algorithmic
 *
 * Simple algorithmic version to control the car (should be more or less fastest), it does not use any form of learning
 */

var Agent = function (environment) {
    var tick = 0;
    var episode = 0;
    var maxEpisodes = 20;
    var stats = [];

    this.update = function () {
        environment.update();

        var state = environment.getState();
        environment.performAction(state>0?0:1);

        tick++;
    };

    this.episodeEnd = function () {
        stats.push(environment.getEpisodeStats());

        episode++;
        if (episode === maxEpisodes) {
            console.log('end!!!');
            environment.end();
            downloadObjectAsJson(stats, environment.getName() + '_episode_stats');
            downloadObjectAsJson(agent.toJSON(), environment.getName() + 'brain');
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
        return "01-algorithmic";
    }

    function getNumStates() {
        return 2;
    }

    function getMaxNumActions() {
        return 6;
    }

    function getState() {
        return game.playerX;
    }

    function getReward() {
        return 0;
    }

    function performAction(action) {
        // execute agent's desired action
        switch (action) {
            case 0:
                game.keyLeft = true;
                game.keyRight = false;
                game.keyFaster = true;
                break;
            case 1:
                game.keyLeft = false;
                game.keyRight = true;
                game.keyFaster = true;
                break;
        }
    }

    function getEpisodeStats() {
        return game.lastLapTime;
    }


    function update() {
    }

    function end() {
        capturer.stop();
        capturer.save();
    }

    return {
        getNumStates: getNumStates,
        getMaxNumActions: getMaxNumActions,
        getState: getState,
        getReward: getReward,
        performAction: performAction,
        getEpisodeStats: getEpisodeStats,
        update: update,
        end: end,
        getName: getName
    }
};


var environment = new Environment(window);
var agent = new Agent(environment);

var capturer = new CCapture({format: 'webm', framerate: 60, name: environment.getName(), verbose: true});

function render() {
    requestAnimationFrame(render);
    capturer.capture(canvas);
}

setTimeout(function () {
    capturer.start();
    render();
}, 1000);





