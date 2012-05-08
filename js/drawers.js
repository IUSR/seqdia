function ArrowIconLeftDrawer(context) {
    var arrowImageHeight = 18;

    this.draw = function (left, top) {
        context.drawImage($('#arrow_left')[0], left + length - 6, top - arrowImageHeight / 2, 20, 20);
    }
}
function ArrowIconRightDrawer(context) {
    var arrowImageHeight = 18;

    this.draw = function (left, top) {
        context.drawImage($('#arrow_right')[0], left + length - 12, top - arrowImageHeight / 2, 20, 20);
    }
}
function BarDrawer() {
    this.draw = function (context, left, top, height) {
        var barWidth = 10;
        context.beginPath();
        hand_drawing_rect(context, left - barWidth / 2, top, barWidth, height, 2);
        context.lineWidth = 2;
        context.strokeStyle = $('#bar').css("border-color");
        context.stroke();
        context.fillStyle = $('#bar').css("background-color");
        context.closePath();
        context.fill();
        context.fillStyle = null;

    }
}
function EntityDrawer() {
    this.draw = function (context, entityName, left, top, selected) {
//        context.font = "bold 14px arial, sans-serif";
//        context.font = "bold 14px chalk board";
        context.font = "bold 14px Comic Sans MS";

        var textMetrics = context.measureText(entityName);
        var rectangleWidth = textMetrics.width + 20;

        var rectangleDrawer = new RectangleDrawer(context);
        rectangleDrawer.draw(left, top, rectangleWidth);

        var maxWidth = 1000;
        if (selected)
            context.fillStyle = "blue";
        else
            context.fillStyle = "black";
        context.fillText(entityName, left + 10, top + 20, maxWidth);
        return rectangleWidth;
    }
}
function GridDrawer(context) {
    this.draw = function (width, height) {
        try {/* vertical lines */
            for (var x = 0.5; x < width; x += 10) {
                context.moveTo(x, 0);
                context.lineTo(x, height);
            }
            /* horizontal lines */
            for (var y = 0.5; y < height; y += 10) {
                context.moveTo(0, y);
                context.lineTo(width, y);
            }
            /* draw it! */
            context.strokeStyle = "#eee";
            context.stroke();
        } catch (err) {
        }
    }
}// draw vertical line
function vertical_hand_drawing_line_to(context, fromX, fromY, toY) {
    var controlX, controlY;
    var offsetX = 3;
    var offsetY = 3;
    controlX = fromX + offsetX * (Math.random() - 0.5);
    var tmpToY = fromY + 200;
    if (tmpToY > toY) tmpToY = toY;

    controlY = fromY / 2 + tmpToY / 2 + offsetY * (Math.random() - 0.5);
    context.quadraticCurveTo(controlX, controlY, fromX, tmpToY);
    if (toY > tmpToY)
        vertical_hand_drawing_line_to(context, fromX, tmpToY, toY);
}

// draw horizontal line
function horizontal_hand_drawing_line_to(context, fromX, fromY, toX) {
    var controlX, controlY;
    var offsetX = 3;
    var offsetY = 3;
    controlY = fromY + offsetY * (Math.random() - 0.5);
    if (toX > fromX) {
        var tmpToX = fromX + 20;
        if (tmpToX > toX) tmpToX = toX;
    } else {
        var tmpToX = fromX - 20;
        if (tmpToX < toX) tmpToX = toX;
    }

    controlX = fromX / 2 + tmpToX / 2 + offsetX * (Math.random() - 0.5);
    context.quadraticCurveTo(controlX, controlY, tmpToX, fromY);
    if ((toX > fromX && toX > tmpToX) || (toX < fromX && toX < tmpToX))
        horizontal_hand_drawing_line_to(context, tmpToX, fromY, toX);
}

function hand_drawing_rect(context, left, top, width, height, radius) {
    context.moveTo(left + radius, top);
    horizontal_hand_drawing_line_to(context, left + radius, top, left + width - radius);
    context.quadraticCurveTo(left + width, top, left + width, top + radius);
    vertical_hand_drawing_line_to(context, left + width, top + radius, top + height - radius);
    context.quadraticCurveTo(left + width, top + height, left + width - radius, top + height);
    horizontal_hand_drawing_line_to(context, left + width - radius, top + height, left + radius);
    context.quadraticCurveTo(left, top + height, left, top + height - radius);
    context.lineTo(left, top + radius);
    context.quadraticCurveTo(left, top, left + radius, top);
}
function HorizontalArrowDrawer(context) {
    this.drawRightArrow = function (left, top, length) {
        new ArrowIconRightDrawer(context).draw(left + length, top);
    };

    this.drawLeftArrow = function (left, top, length) {
        new ArrowIconLeftDrawer(context).draw(left + length, top);
    };

    this.draw = function (left, top, length) {
        // draw the line: ----
        // draw the arrow icon
        if (length > 0) {
            new HorizontalLineDrawer(context).draw(left + 5, top, length - 10);
            this.drawRightArrow(left + 5, top, length - 10);
        } else {
            new HorizontalLineDrawer(context).draw(left - 5, top, length + 10);
            this.drawLeftArrow(left - 5, top, length + 10);
        }
    }
}// This is to draw a horizontal line like: -----
function HorizontalLineDrawer(context) {
    this.draw = function (left, top, length) {
        context.beginPath();
        context.moveTo(left, top);
//        context.lineTo(left + length, top);
        horizontal_hand_drawing_line_to(context, left, top, left + length);
        context.lineWidth = 2;
        context.strokeStyle = $('#message').css("color");
        context.stroke();
    };


}
function InternalInvokeDrawer() {
    var length = 50;
    var height = 30;
    this.draw = function (context, message, left, top) {
        context.beginPath();
        left = left + 5;
        context.moveTo(left, top);
        horizontal_hand_drawing_line_to(context, left, top, left + length);
        context.quadraticCurveTo(left + length + 5, top + 5, left + length, top + height);
        horizontal_hand_drawing_line_to(context, left + length, top + height, left);
        context.strokeStyle = "#000";
        context.lineWidth = 2;
        context.stroke();

        new ArrowIconLeftDrawer(context).draw(left, top + height);

        new LabelDrawer(context).draw(message, left, length, top);
    }
}
function LabelDrawer(context) {
    this.draw = function (message, left, length, top) {
        var maxWidth = 1000;
        var textMetrics = context.measureText(message);
        context.font = "14px Comic Sans MS";

        context.fillStyle = "black";
        if (length > 0) {
            var newLeft = left + length / 2 - textMetrics.width / 2;
            if (newLeft < left) newLeft = left;
            context.fillText(message, newLeft, top - 3, 300);
        } else {
            var newLeft = left + length / 2 - textMetrics.width / 2;
            context.fillText(message, newLeft, top - 3, 300);
        }

    }
}
function LifeLineDrawer() {
    this.draw = function (context, entityName, left, lifeLength, selected) {
        var top = 20;
        var entityHeight = 30;

        var entityDrawer = new EntityDrawer();
        var entityWidth = entityDrawer.draw(context, entityName, left, top, selected);

        var lineDrawer = new LineDrawer();
        lineDrawer.draw(context, left + (entityWidth) / 2, top + entityHeight, lifeLength);

        return entityWidth;
    }
}
function LineDrawer() {
    this.draw = function (context, left, top, height) {
        context.beginPath();
        context.moveTo(left, top);

        vertical_hand_drawing_line_to(context, left, top, top + height);
        /* draw it! */
        context.lineWidth = 2;
        context.strokeStyle = $('#line').css("color");
        context.stroke();
    };


}
function MessageDrawer() {
    this.draw = function (context, message, left, top, length) {
        new HorizontalArrowDrawer(context).draw(left, top, length);
        new LabelDrawer(context).draw(message, left, length, top);
    }
}
function RectangleDrawer(context) {
    this.draw = function (left, top, width) {
        var height = 30;
        var radius = 5;

        context.beginPath();
        hand_drawing_rect(context, left, top, width, height, radius);
//        context.moveTo(left+radius, top);
//        horizontal_cairo_curve_to(context, left + radius, top, left + width - radius);
//        context.quadraticCurveTo(left+width, top, left+width, top+radius);
//        context.lineTo(left+width, top+height-radius);
//        context.quadraticCurveTo(left+width, top+height, left+width-radius, top+height);
//        horizontal_cairo_curve_to(context, left + width - radius, top+height, left + radius);
//        context.quadraticCurveTo(left, top+height, left, top+height-radius);
//        context.lineTo(left, top+radius);
//        context.quadraticCurveTo(left, top, left+radius, top);
        context.closePath();
        context.stroke();
    };


}