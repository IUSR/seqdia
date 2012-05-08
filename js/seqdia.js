(function( $ ) {
    var drawGrid = function() {
        this.canvasManager.drawGrid();
    }
    var act = function(name) {
        this.activity = new ActivitySequence(name);
    }
    var script = function(script, redraw_now) {
        this.scriptString = script;
        if (redraw_now) {
            return this.redraw();
        }
        return this;
    }
    var redraw = function () {
        this.activity.draw(this.canvasManager, this.scriptString);
        this.lastXOffset = 0;
        this.lastYOffset = 0;
        return this;
    }
    var resetCanvasPosition = function() {
        this.offset({ top: this.offset().top, left: 0 });
        this.lastXOffset = 0;
        this.lastYOffset = 0;
    }

    $.fn.seqdia = function(allow_dragging) {
        var width = this.width();
        var height = this.height();

        // perform immediate scripting when there's no nested HTML elements
        // but only character string contents
        var num_children = this.children().length;
        var immediate_script;
        if (num_children == 0) {
            immediate_script = this.text();
        }

        // clear everything
        this.html('');

        this.canv_grid = $('<canvas width="' + width + '" height="' + height + '" class="canvas" style="z-index:1000"></canvas>');
        this.canv_entity = $('<canvas width="' + width + '" height="' + height + '" class="canvas" style="z-index:1000"></canvas>');
        this.canv_message = $('<canvas width="' + width + '" height="' + height + '" class="canvas" style="z-index:5000"></canvas>');
        this.canv_bar = $('<canvas width="' + width + '" height="' + height + '" class="canvas" style="z-index:3000"></canvas>');
        this.append(this.canv_grid).append(this.canv_entity).append(this.canv_message).append(this.canv_bar);

        this.canvasManager = new CanvasManager(this);

        this.canvasManager.grid = this.canv_grid.get(0);
        this.canvasManager.entity = this.canv_entity.get(0);
        this.canvasManager.message = this.canv_message.get(0);
        this.canvasManager.bar = this.canv_bar.get(0);

        var dia = this;

        if (allow_dragging) {
            this.get().onmousedown = function(event) {
                dia.startMove(event);
                return true;
            };
            this.get().onmouseup = function(event) {
                dia.endMove(event);
                return false;
            };
            this.get().ondblclick = function() {
                dia.resetCanvasPosition();
                return true;
            };
            /*
            this.bind('mousedown', function(event) {
                dia.startMove(event);
                return true;
            }, false);
            this.bind('mouseup', function(event) {
                dia.endMove(event);
            }, true);
            this.bind('dblclick', function() {
                dia.resetCanvasPosition();
            }, false);
            */
            /*
            onmousedown="startMove(event); return true;"
            onmouseup="endMove(event); return false;"
            ondblclick="resetCanvasPosition(); return true;"
            */
        }

        this.drawGrid = drawGrid;
        this.act = act;
        this.script = script;
        this.redraw = redraw;
        this.resetCanvasPosition = resetCanvasPosition;

        this.startMove = function(event) {
            dia.bind('onmousemove', dia.dragCanvas);
            dia.orignalX = event.screenX;
            dia.orignalY = event.screenY;
        }

        this.dragCanvas = function(event) {
            if (event == null) event = window.event;
            var offsetY = event.screenY - dia.orignalY;
            var totalOffsetY = dia.lastYOffset + offsetY;
            var offsetX = event.screenX - dia.orignalX;
            var totalOffsetX = dia.lastXOffset + offsetX;
            if (totalOffsetY < 5 && totalOffsetX < 5) {
                dia.offset({ left: totalOffsetX, top: totalOffsetY + dia.offset().top });
            }
        }

        this.endMove = function(event) {
            dia.unbind('onmousemove');
            if (event == null) event = window.event;

            dia.lastXOffset = dia.lastXOffset + event.screenX - dia.orignalX;
            dia.lastYOffset = dia.lastYOffset + event.screenY - dia.orignalY;
            if (dia.lastXOffset > 0) {
                dia.lastXOffset = 0;
            }
            if (dia.lastXOffset < -1000) {
                dia.lastXOffset = -1000;
            }
            if (dia.lastYOffset > 0) {
                dia.lastYOffset = 0;
            }
            if (dia.lastYOffset < -1500) {
                dia.lastYOffset = -1500;
            }
        }

        if (num_children == 0) {
            this.act(this.get(0).id);
            this.script(immediate_script)
                .redraw();
        }

        return this;
    };
})( jQuery );

