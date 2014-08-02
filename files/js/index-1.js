function Tetris2048($element, options){
    options = $.extend({
        horizontal: 4,
        vertical: 8,
        className: 'tetris2048',
        classes: ['-grid', '-row', '-cell', '-objects', '-object', '-object-float', '-swipe']
    }, options);

    var cellWidth, cellHeight,
        $grid, $cell, $objects, $object, $swipe,
        classes = [], grid = [];

    function Object(i, j, value){
        this.$element = $('<div class="' + classes[4] + '"></div>');
        this.i = i;
        this.j = j;
        this.value = value;
        this.$element.css('opacity', 0.5+Math.random()/2);

        this.drow = function(){
            this.$element.css({
                'top': this.i * cellHeight + 'px',
                'left': this.j * cellWidth + 'px'
            });
            this.$element.html(this.value);
        }
        this.remove = function(){
            var $e = this.$element;
            setTimeout(function(){
                $e.remove();
            },200);

        }
        this.drow();
    }

    function init(){
        var i, j, key, gridRow, $row, $cell;
        for(key in options.classes){
            classes.push(options.className + options.classes[key]);
        }

        for(i=0; i<options.vertical; i++){
            gridRow = [];
            for(j=0; j<options.horizontal; j++){
                gridRow.push(null);
            }
            grid.push(gridRow);
        }

        $element.addClass(options.className);

        $grid = $('<div class="' + classes[0] + '"></div>');
        for(i=0; i<options.vertical; i++){
            $row = $('<div class="' + classes[1] + '"></div>');
            for(j=0; j<options.horizontal; j++){
                $cell = $('<div class="' + classes[2] + '"></div>');
                $row.append($cell);
            }
            $grid.append($row);
        }
        $element.append($grid);

        $objects = $('<div class="' + classes[3] + '"></div>');
        $element.append($objects);

        $cell = $grid.find('.'+classes[2]);
        $object = $objects.find('.'+classes[4]);

        cellWidth = $cell.eq(0).outerWidth(true);
        cellHeight = $cell.eq(0).outerHeight(true);

        addRandomObject();
        
        $swipe = $('<div class="' + classes[6] + '"></div>')
        $element.append($swipe);
        $swipe
        .on('swipeleft', function(e) {
            moveLeft();
            addRandomObject();
        })
        .on('swiperight', function(e) {
            moveRight();
            addRandomObject();
        })
        .on('swipedown', function(e) {
            moveDown();
            addRandomObject();
        });
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
        var i, j, value;
        i = Math.round(Math.random()*2);
        j = Math.round(Math.random()*(options.horizontal-1));
        value = Math.pow(2, Math.round(1+Math.random()));
        if(!addObject(i, j, value)){
            addRandomObject();
        }
    }

    function moveLeft(){
        var i, j, currentJ, object, prevObject;
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
                    }
                    if(prevObject != null && prevObject.value == object.value){
                        prevObject.value += object.value;
                        prevObject.drow();
                        grid[object.i][object.j] = null;
                        object.remove();

                        prevObject = null;

                    }
                    else{
                        prevObject = object;
                        currentJ++;
                    }
                }
            }
        }
    }
    
    function moveRight(){
        var i, j, currentJ, object, prevObject;
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
                    }
                    if(prevObject != null && prevObject.value == object.value){
                        prevObject.value += object.value;
                        prevObject.drow();
                        grid[object.i][object.j] = null;
                        object.remove();

                        prevObject = null;

                    }
                    else{
                        prevObject = object;
                        currentJ--;
                    }
                }
            }
        }
    }
    
    function moveDown(){
        var i, j, currentI, object, prevObject;
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
                    }
                    if(prevObject != null && prevObject.value == object.value){
                        prevObject.value += object.value;
                        prevObject.drow();
                        grid[object.i][object.j] = null;
                        object.remove();

                        prevObject = null;

                    }
                    else{
                        prevObject = object;
                        currentI--;
                    }
                }
            }
        }
    }

    init();

    $(window).keydown(function(e){
        var key = e.keyCode || e.which;
        console.log(key);
        switch(key){
            case 37:
                moveLeft();
                addRandomObject();
                break;
            case 39:
                moveRight();
                addRandomObject();
                break;
            case 40:
                moveDown();
                addRandomObject();
                break;
        }
    });
}
$(document).ready(function(){
    var tetris2048 = new Tetris2048($('#tetris2048'));

});
