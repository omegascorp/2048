function Tetris2048($element, options){
    options = $.extend({
        horizontal: 4,
        vertical: 4,
        className: 'tetris2048',
        classes: {
            grid: '-grid',
            row: '-row',
            cell: '-cell',
            objects: '-objects',
            object: '-object',
            objectFloat: '-object-float',
            swipe: '-swipe',
            menu: '-menu',
            button: '-button',
            game: '-game'
        }
    }, options);

    var cellWidth, cellHeight, cellMargin = 4, demoInterval, gameWidth, gameHeight,
        isPaused = true,
        $grid, $cell, $objects, $object, $swipe,
        $menu, $menuPlay, $game,
        classes = [], grid = [], user = 1;
    
    function Object(i, j, value){
        var that = this;
        this.$element = $('<div class="' + classes['object'] + '"></div>');
        this.i = i;
        this.j = j;
        this.value = value;
        if(user == 1){
            this.$element.css('background', '#bb00bb');
            user = 2;
        }
        else{
            this.$element.css('background', '#0000bb');
            user = 1;
        }
        this.$element.css({
            'opacity': '.5',
            'text-align': 'center'
        });
        setTimeout(function(){
            that.$element.css('opacity', '1');
        });
        
        this.drow = function(){
            var fontSize;
            if(this.value < 100){
                fontSize = Math.round(cellHeight * 0.6);
            }
            else if (this.value < 1000){
                fontSize = Math.round(cellHeight * 0.5);
            }
            else if (this.value < 10000){
                fontSize = Math.round(cellHeight * 0.4);
            }
            else{
                fontSize = Math.round(cellHeight * 0.3);
            }
            this.$element.css({
                'top': this.i * (cellHeight + cellMargin * 2) + 'px',
                'left': this.j * (cellWidth + cellMargin * 2) + 'px',
                'height': cellHeight + 'px',
                'width': cellWidth + 'px',
                'margin': cellMargin + 'px',
                'font-size': fontSize + 'px',
                'line-height': cellHeight + 'px'
            });
            this.$element.html(this.value);
        }
        this.remove = function(){
            var $e = this.$element;
            this.$element.css('z-index', 0);
            setTimeout(function(){
                $e.remove();
            },200);

        }
        this.drow();
    }

    function init(){
        var i, j, key, gridRow, $gridRow, $gridCell;
        for(key in options.classes){
            classes[key] = options.className + options.classes[key];
        }

        for(i=0; i<options.vertical; i++){
            gridRow = [];
            for(j=0; j<options.horizontal; j++){
                gridRow.push(null);
            }
            grid.push(gridRow);
        }
        
        $element.addClass(options.className);
        
        $menu = $('<div class="' + classes['menu'] + '"></div>');
        $element.append($menu);
        
        $menuPlay = $('<div class="' + classes['button'] + '">New game</div>');
        $menuPlay.click(function(){
            $menu.fadeOut();
            clear();
            addRandomObject();
            play();
            clearInterval(demoInterval);
        });
        $menu.append($menuPlay);
        
        gameWidth = gameHeight = Math.min($(window).height(), $(window).width());
        cellWidth = gameWidth / options.horizontal - cellMargin * 2;
        cellHeight = gameHeight / options.vertical - cellMargin * 2;
        
        
        $game = $('<div class="' + classes['game'] + '"></div>');
        $game.css({
            width: gameWidth + 'px',
            height: gameHeight + 'px'
        });
        $element.append($game);
        
        $grid = $('<div class="' + classes['grid'] + '"></div>');
        for(i=0; i<options.vertical; i++){
            $gridRow = $('<div class="' + classes['row'] + '"></div>');
            for(j=0; j<options.horizontal; j++){
                $gridCell = $('<div class="' + classes['cell'] + '"></div>');
                $gridCell.css({
                    height: cellHeight,
                    width: cellWidth,
                    margin: cellMargin
                });
                $gridRow.append($gridCell);
            }
            $grid.append($gridRow);
        }
        $game.append($grid);

        $objects = $('<div class="' + classes['objects'] + '"></div>');
        $game.append($objects);

        $cell = $grid.find('.'+classes['cell']);
        $object = $objects.find('.'+classes['object']);

        //cellWidth = $cell.eq(0).outerWidth(true);
        //cellHeight = $cell.eq(0).outerHeight(true);

        addRandomObject();
        
        $swipe = $('<div class="' + classes['swipe'] + '"></div>')
        $game.append($swipe);
        $swipe
        .on('swipeleft', function(e) {
            if(isPaused){
                return;
            }
            if(moveLeft()){
                step();
            }
        })
        .on('swipeup', function(e) {
            if(isPaused){
                return;
            }
            if(moveUp()){
                step();
            }
        })
        .on('swiperight', function(e) {
            if(isPaused){
                return;
            }
            if(moveRight()){
                step();
            }
        })
        .on('swipedown', function(e) {
            if(isPaused){
                return;
            }
            if(moveDown()){
                step();
            }
        });
        
        demoInterval = setInterval(function(){
            var rand = Math.round(Math.random()*3);
            switch(rand){
                case 0:
                    if(moveLeft()){
                        step();
                    }
                    break;
                case 1:
                    if(moveUp()){
                        step();
                    }
                    break;
                case 2:
                    if(moveRight()){
                        step();
                    }
                    break;
                case 3:
                    if(moveDown()){
                        step();
                    }
                    break;
            }
        }, 1000);
    }
    
    function resize(){
        var i, j, object;
        gameWidth = gameHeight = Math.min($(window).height(), $(window).width());
        cellWidth = gameWidth / options.horizontal - cellMargin * 2;
        cellHeight = gameHeight / options.vertical - cellMargin * 2;
        
        $game.css({
            width: gameWidth + 'px',
            height: gameHeight + 'px'
        });
        
        $cell.css({
            height: cellHeight,
            width: cellWidth,
            margin: cellMargin
        });
        
        for(i=0; i<options.vertical; i++){
            for(j=0; j<options.vertical; j++){
                object = grid[i][j];
                if(object != null){
                    object.drow();
                }
            }
        }
    }

    function addObject(i, j, value){
        var object;

        if(i < options.vertical && j < options.horizontal && grid[i][j] == null){
            object = new Object(i, j, value);
            grid[i][j] = object;
            $objects.append(object.$element);
            return true;
        }
        return false;
    }

    function addRandomObject(){
        var i, j, value, index, selected, positions = [];
        for(i=0; i<options.vertical; i++){
            for(j=0; j<options.vertical; j++){
                if(grid[i][j] == null){
                    positions.push([i,j]);
                }
            }
        }
        if(positions.length > 0){
            value = Math.pow(2, Math.round(1+Math.random()));
            index = Math.round(Math.random()*(positions.length-1));
            selected = positions[index];
            addObject(selected[0], selected[1], value);
            return true;
        }
        return false;
    }
    
    function clear(){
        var i, j, object;
        for(i=0; i<options.vertical; i++){
            for(j=0; j<options.vertical; j++){
                object = grid[i][j];
                if(object != null){
                    object.remove();
                }
                grid[i][j] = null;
            }
        }
    }
    
    function pause(){
        isPaused = true;
    }
    
    function play(){
        isPaused = false;
    }
    
    function step(){
        if(addRandomObject()){
            if(!hasMovies()){
                $menu.fadeIn();
                pause();
            }
        }
        else{
            $menu.fadeIn();
            pause();
        }
    }
    
    function hasMovies(){
        var i, j, object, objectRight, objectBottom;
        for(i=0; i<options.vertical; i++){
            for(j=0; j<options.vertical; j++){
                object = grid[i][j];
                if(object == null) {
                    return true;
                }
                if(j + 1 < options.horizontal){
                    objectRight = grid[i][j+1];
                    if(objectRight == null || object.value == objectRight.value) {
                        return true;
                    }
                }
                if(i + 1 < options.vertical){
                    objectBottom = grid[i+1][j];
                    if(objectBottom == null || object.value == objectBottom.value) {
                        return true;
                    }
                }
            }
        }
    }

    function moveLeft(){
        var i, j, currentJ, object, prevObject,
            isMoved = false;
        for(i=0; i<options.vertical; i++){
            currentJ = 0;
            prevObject = null;
            for(j=0; j<options.vertical; j++){
                object = grid[i][j];
                if(object != null){
                    if(currentJ != j){
                        object.j = currentJ;
                        grid[i][currentJ] = object;
                        grid[i][j] = null;
                        object.drow();
                        isMoved = true;
                    }
                    if(prevObject != null && prevObject.value == object.value){
                        prevObject.value += object.value;
                        prevObject.drow();
                        grid[object.i][object.j] = null;
                        object.i = prevObject.i;
                        object.j = prevObject.j;
                        object.drow();
                        object.remove();

                        prevObject = null;
                        isMoved = true;
                    }
                    else{
                        prevObject = object;
                        currentJ++;
                    }
                }
            }
        }
        return isMoved;
    }
    
    function moveRight(){
        var i, j, currentJ, object, prevObject,
            isMoved = false;
        for(i=0; i<options.vertical; i++){
            currentJ = options.horizontal-1;
            prevObject = null;
            for(j=options.horizontal-1; j>=0; j--){
                object = grid[i][j];
                if(object != null){
                    if(currentJ != j){
                        object.j = currentJ;
                        grid[i][currentJ] = object;
                        grid[i][j] = null;
                        object.drow();
                        isMoved = true;
                    }
                    if(prevObject != null && prevObject.value == object.value){
                        prevObject.value += object.value;
                        prevObject.drow();
                        grid[object.i][object.j] = null;
                        object.i = prevObject.i;
                        object.j = prevObject.j;
                        object.drow();
                        object.remove();

                        prevObject = null;
                        isMoved = true;
                    }
                    else{
                        prevObject = object;
                        currentJ--;
                    }
                }
            }
        }
        return isMoved;
    }
    
    function moveDown(){
        var i, j, currentI, object, prevObject,
            isMoved = false;
        for(j=0; j<options.horizontal; j++){
            currentI = options.vertical-1;
            prevObject = null;
            for(i=options.vertical-1; i>=0; i--){
                object = grid[i][j];
                if(object != null){
                    if(currentI != i){
                        object.i = currentI;
                        grid[currentI][j] = object;
                        grid[i][j] = null;
                        object.drow();
                        isMoved = true;
                    }
                    if(prevObject != null && prevObject.value == object.value){
                        prevObject.value += object.value;
                        prevObject.drow();
                        grid[object.i][object.j] = null;
                        object.i = prevObject.i;
                        object.j = prevObject.j;
                        object.drow();
                        object.remove();

                        prevObject = null;
                        isMoved = true;
                    }
                    else{
                        prevObject = object;
                        currentI--;
                    }
                }
            }
        }
        return isMoved;
    }
    
    function moveUp(){
        var i, j, currentI, object, prevObject,
            isMoved = false;
        for(j=0; j<options.horizontal; j++){
            currentI = 0;
            prevObject = null;
            for(i=0; i<options.vertical; i++){
                object = grid[i][j];
                if(object != null){
                    if(currentI != i){
                        object.i = currentI;
                        grid[currentI][j] = object;
                        grid[i][j] = null;
                        object.drow();
                        isMoved = true;
                    }
                    if(prevObject != null && prevObject.value == object.value){
                        prevObject.value += object.value;
                        prevObject.drow();
                        grid[object.i][object.j] = null;
                        object.i = prevObject.i;
                        object.j = prevObject.j;
                        object.drow();
                        object.remove();

                        prevObject = null;
                        isMoved = true;
                    }
                    else{
                        prevObject = object;
                        currentI++;
                    }
                }
            }
        }
        return isMoved;
    }

    init();

    $(window).keydown(function(e){
        if(isPaused){
            return;
        }
        var key = e.keyCode || e.which;
        switch(key){
            case 37:
                if(moveLeft()){
                    step();
                }
                break;
            case 38:
                if(moveUp()){
                    step();
                }
                break;
            case 39:
                if(moveRight()){
                    step();
                }
                break;
            case 40:
                if(moveDown()){
                    step();
                }
                break;
        }
    });
    
    $(window).resize(function(){
        resize();
    });
}
$(document).ready(function(){
    var tetris2048 = new Tetris2048($('#tetris2048'));
});
