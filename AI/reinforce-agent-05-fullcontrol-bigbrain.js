/**
 * name: 05-fullcontrol-bigbrain
 *
 * Full control agent: takes its x position on the road and its own speed as input and allows left, neutral and right with full throttle, neutral and braking.
 * Reward is speed of car.
 *
 * Bigger brain to compensate for more output nodes.
 */

var Agent = function (environment) {
    var tick = 0;
    var episode = 0;
    var maxEpisodes = 20;
    var stats = [];

    var spec = {
        update: 'qlearn', // qlearn | sarsa
        gamma: 0.9, // discount factor, [0, 1)
        epsilon: 0.1, // initial epsilon for epsilon-greedy policy, [0, 1)
        alpha: 0.1, //0.005; // value function learning rate
        experience_add_every: 5, // number of time steps before we add another experience to replay memory
        experience_size: 10000, // size of experience
        learning_steps_per_iteration: 5,
        tderror_clamp: 1.0, // for robustness
        num_hidden_units: 40 // number of neurons in hidden layer
    };

    var agent = new RL.DQNAgent(environment, spec); // give agent a TD brain

    this.update = function () {
        environment.update();

        if (tick > 0) {
            agent.learn(environment.getReward());
        }
        // activate the neural network
        var action = agent.act(environment.getState());

        environment.performAction(action);

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
        return "05-fullcontrol-bigbrain";
    }

    function getNumStates() {
        return 2;
    }

    function getMaxNumActions() {
        return 9;
    }

    function getState() {
        return [(game.playerX + 2) / 4, game.speed / game.maxSpeed];
    }

    function getReward() {
        return game.speed / game.maxSpeed;
    }

    function performAction(action) {
        // execute agent's desired action
        switch (action) {
            case 0:
                game.keyLeft = false;
                game.keyRight = false;
                game.keyFaster = true;
                game.keySlower = false;
                break;
            case 1:
                game.keyLeft = true;
                game.keyRight = false;
                game.keyFaster = true;
                game.keySlower = false;
                break;
            case 2:
                game.keyLeft = false;
                game.keyRight = true;
                game.keyFaster = true;
                game.keySlower = false;
                break;
            case 3:
                game.keyLeft = false;
                game.keyRight = false;
                game.keyFaster = false;
                game.keySlower = false;
                break;
            case 4:
                game.keyLeft = true;
                game.keyRight = false;
                game.keyFaster = false;
                game.keySlower = false;
                break;
            case 5:
                game.keyLeft = false;
                game.keyRight = true;
                game.keyFaster = false;
                game.keySlower = false;
                break;
            case 6:
                game.keyLeft = false;
                game.keyRight = false;
                game.keyFaster = false;
                game.keySlower = true;
                break;
            case 7:
                game.keyLeft = true;
                game.keyRight = false;
                game.keyFaster = false;
                game.keySlower = true;
                break;
            case 8:
                game.keyLeft = false;
                game.keyRight = true;
                game.keyFaster = false;
                game.keySlower = true;
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





