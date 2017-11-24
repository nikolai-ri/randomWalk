class RandomWalk{
    constructor(numOfWalkers, xCoordUpp, yCoordUpp, containerHeight, containerWidth, partsOfScreen, windowHeight, walkerContainerNode, numberOfSteps, graphData, toggleBoarders, toggleCollisions){
        this.numOfWalkers = numOfWalkers;
        this.xCoordUpp = xCoordUpp;
        this.yCoordUpp = yCoordUpp;
        this.containerHeight = containerHeight;
        this.containerWidth = containerWidth;
        this.partsOfScreen = partsOfScreen;
        this.windowHeight = windowHeight;
        this.walkerContainerNode = walkerContainerNode;
        this.walkerNodes = [];
        this.totalDistance = 0;
        this.collisionsNumber = 0;
        this.numberOfSteps = numberOfSteps;
        this.graphData = graphData;
        this.toggleBoarders = toggleBoarders;
        this.toggleCollisions = toggleCollisions;
        this.expectedValue = 0;
    }

    setToggleBoarders(toggleBoarders){
        this.toggleBoarders = toggleBoarders;
    }

    setToggleCollisions(toggleCollisions){
        this.toggleCollisions = toggleCollisions;
    }

    getExpectedValue(){
        return this.expectedValue;
    }

    allWalkersIteration() {
        let that = this;
        return new Promise(function(res, rej){
            for (let k = 0; k < that.walkerNodes.length; k++) {	
                while(that.oneWalkerIteration(that.walkerNodes[k])){
                }
                if(k === that.walkerNodes.length - 1) res('done');
            }	
        });
    }
    
    /** 
        * This function creates the walkers randomly. The spread of the distribution, the center of the distribution 
        * and the number of walkers can be parametrized.
    */
    createWalkers(){
        this.walkerNodes = [];
        for (let i = 0; i < this.numOfWalkers; i++){
            let walker = new Walker(this.xCoordUpp,
                                    this.yCoordUpp,
                                    this.containerHeight,
                                    this.containerWidth,
                                    this.partsOfScreen,
                                    this.windowHeight,
                                    i);
            this.walkerContainerNode.appendChild(walker.walkersNode);
            this.walkerNodes.push(walker);
        }
    }

    createOneWalker(e){

        let walker = new Walker(this.xCoordUpp,
                                this.yCoordUpp,
                                this.containerHeight,
                                this.containerWidth,
                                this.partsOfScreen,
                                this.windowHeight,
                                this.walkerNodes.length);
        walker.walkersNode.style.top = e.layerY + 'px';
        walker.walkersNode.style.left = e.layerX + 'px';
        walker.posTop = e.layerY;
        walker.posLeft = e.layerX;
        this.walkerContainerNode.appendChild(walker.walkersNode);
        this.walkerNodes.push(walker);
    }
    /**
     * Makes the move of one walker, with border and collision checks.
     * @param object - currentWalker 
     * @returns boolean - Returns false if no collision was detected, i.e. if the walker made a successfull move. 
     *                    Returns true, if collision detected, thereby keeping the while loop in allWalkersIteration going.
     */
    oneWalkerIteration(currentWalker){ 
        let tempPosTop,
            tempPosLeft,
            direction;

        direction = [((Math.floor(Math.random() * 3) + 1) - 2) * this.windowHeight/100, ((Math.floor(Math.random() * 3) + 1) - 2) * this.windowHeight/100];
        
        //Increase the position in X direction
        tempPosLeft = currentWalker.posLeft + direction[0];

        if(this.toggleBoarders){
            if(!this.checkVerticalBorder(currentWalker, direction)){
                currentWalker.updatePositionX(tempPosLeft, direction[0]);
            }
        } else {
            currentWalker.updatePositionX(tempPosLeft, direction[0]);
        }
                
        // Increase the position in Y direction
        tempPosTop = currentWalker.posTop + direction[1];

        if(this.toggleBoarders){
            if(!this.checkHorizontalBorder(currentWalker, direction)){
                currentWalker.updatePositionY(tempPosTop, direction[1]);
            }
        } else {
            currentWalker.updatePositionY(tempPosTop, direction[1]);
        }
        
        // Calculate the mean total distance
        this.expectedValue += direction[0] + direction[1];
        this.expectedValue /= this.numberOfSteps;  

        if(this.toggleCollisions === true){
            if(this.checkCollision(currentWalker)){
                return true;
            }
        }
        
        return false;

    }

    checkVerticalBorder(currentWalker, direction){
        let limitPosition;
        if (currentWalker.posLeft + direction[0] > this.walkerContainerNode.clientLeft + this.walkerContainerNode.clientWidth - this.windowHeight/100){
            limitPosition = currentWalker.posLeft + direction[0] - this.windowHeight / 100;
            currentWalker.updatePositionX(limitPosition, direction[0])
            return true;
        }
        
        if (currentWalker.posLeft + direction[0] < this.walkerContainerNode.clientLeft){
            limitPosition = currentWalker.posLeft + direction[0] + this.windowHeight / 100;
            currentWalker.updatePositionX(limitPosition, direction[0]);
            return true;
        }

        return false;

    }

    checkHorizontalBorder(currentWalker, direction){
        let limitPosition;
        if (currentWalker.posTop + direction[1] > this.walkerContainerNode.clientTop + this.walkerContainerNode.clientHeight - this.windowHeight/100){
            limitPosition = currentWalker.posTop + direction[1] - this.windowHeight / 100;
            currentWalker.updatePositionY(limitPosition, direction[1]);
            return true;
        }
        
        if (currentWalker.posTop + direction[1] < this.walkerContainerNode.clientTop){
            limitPosition = currentWalker.posTop + direction[1] + this.windowHeight / 100;
            currentWalker.updatePositionY(limitPosition, direction[1])
            return true;
        }
        
        return false;
            
    }
    
    checkCollision(currentWalker){
        for (let i = 0; i < this.walkerNodes.length; i++){	
            if(currentWalker.posTop - this.walkerNodes[i].posTop < this.windowHeight/100 && 
               currentWalker.posTop - this.walkerNodes[i].posTop > - this.windowHeight/100 && 
               currentWalker.index != i){
                if(currentWalker.posLeft - this.walkerNodes[i].posLeft < this.windowHeight/100 && 
                   currentWalker.posLeft - this.walkerNodes[i].posLeft > -this.windowHeight/100 > 0){
                    return true;	
                }
            }
        }
        return false;
    }

    removeChilds(node) {
        while (node.hasChildNodes())
            node.removeChild(node.firstChild);
    }
}