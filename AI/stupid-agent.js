

var oldSpeed = 0;

function agentUpdate(){

    //var acceleration  =

    keyFaster = true;
    keyLeft = playerX > 0;
    keyRight = playerX < 0;
    // keyRight = Math.random()*2 < 1? false : true;


    // player X  = -1 to 1 is road
    requestAnimationFrame(agentUpdate);
}


requestAnimationFrame(agentUpdate);

