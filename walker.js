class Walker {
    constructor(xCoordUpp, yCoordUpp, containerHeight, containerWidth, partsOfScreen, windowHeight, id){
        this.id = 'walker' + id;
        this.index = id;
        this.xCoordUpp = xCoordUpp;
        this.yCoordUpp = yCoordUpp;
        this.containerHeight = containerHeight;
        this.containerWidth = containerWidth;
        this.partsOfScreen = partsOfScreen;
        this.windowHeight = windowHeight;
        this.posTop = Math.floor(Math.random()*(this.containerHeight  - this.windowHeight / 100) / (100 / this.partsOfScreen)) + (this.yCoordUpp);
        this.posLeft = Math.floor(Math.random()*(this.containerWidth - this.windowHeight / 100)) + (this.xCoordUpp);
        this.walkersNode = this.createWalkerNode();
        this.distance = [0,0];
        
    }

    createWalkerNode(){
        let div = document.createElement("div");
        div.className = 'walker';
        div.id = this.id;
        div.style.top = this.posTop + "px";
        div.style.left = this.posLeft + "px";

        return div;
    }

    updatePositionX(tempPosLeft, dir){
        this.posLeft = tempPosLeft;
        this.walkersNode.style.left = tempPosLeft + 'px';
        this.distance[0] += dir;
    }

    updatePositionY(tempPosTop, dir){
        this.posTop = tempPosTop;
        this.walkersNode.style.top = tempPosTop + 'px';
        this.distance[1] += dir;
    }
}