function CanvasManager(container) {
    this.lifeLineDrawer = new LifeLineDrawer();
    this.messageDrawer = new MessageDrawer();
    this.internlInvokeDrawer = new InternalInvokeDrawer();
    this.barDrawer = new BarDrawer();
    this.entitySpace = 60.1;
    this.lifeLenght = 2000;
    this.rightBound = 0;
    this.entities = new Array();

    this.drawGrid = function () {
        var canvas = this.grid;
        var context = canvas.getContext('2d');
        var gridDrawer = new GridDrawer(context);
        gridDrawer.draw(canvas.width, canvas.height);
    };

    this.addEntity = function(entityName) {
        var context = this.entity.getContext('2d');
        var newLeft = 0;
        newLeft = this.rightBound + this.entitySpace;
        var entityWidth = this.lifeLineDrawer.draw(context, entityName, newLeft, this.lifeLenght, false);
        this.rightBound = newLeft + entityWidth;
        var entity = new RichEntity(entityName, newLeft, entityWidth);
        this.entities.push(entity);
    };

    this.getEntity = function(entityName) {
        for (var i in this.entities) {
            var entity = this.entities[i];
            if (entity.name == entityName) return entity;
        }
    };

    this.removeAllEntities = function() {
        var canvas = this.entity;
        if (canvas) {
            var context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height)
        }
        this.entities.length = 0;
        this.rightBound = 0;
    };

    this.removeAllMessages = function() {
        var canvas = this.message;
        if (canvas) {
            var context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height)
        }
    };

    this.drawPresentationMessage = function(presentationMessage) {
        var messageContext = this.message.getContext('2d');
        var entityFrom = this.getEntity(presentationMessage.fromEntity);
        var entityTo = this.getEntity(presentationMessage.toEntity);
        var canvas = this.bar;
        var barContext = canvas.getContext('2d');
        if (entityFrom == entityTo) {
            var left = entityFrom.left + entityFrom.width / 2;
            new InternalInvokeDrawer()
                    .draw(messageContext, presentationMessage.messageText, left, presentationMessage.top);
            this.barDrawer.draw(barContext, left, presentationMessage.top + 30, presentationMessage.getBarHeight())

        } else {
            var start = entityFrom.left + entityFrom.width / 2;
            var end = entityTo.left + entityTo.width / 2;
            var length = end - start;
            this.messageDrawer.draw(messageContext, presentationMessage.messageText, start, presentationMessage.top, length);


            this.barDrawer.draw(barContext, end, presentationMessage.top, presentationMessage.getBarHeight())

        }

        for (var i in presentationMessage.childrenMessages) {
            var subPMessage = presentationMessage.childrenMessages[i];
            this.drawPresentationMessage(subPMessage);
        }
    };

}

function MessageConverter() {
    this.idGenerator = 0;
    this.topMargin = 90;
    this.nextTop = this.topMargin;
    this.currentPresentationMessage = null;

    this.visit = function(syncMessage) {

        var nextTop = this.topMargin;
        if (this.currentPresentationMessage)
            nextTop = this.currentPresentationMessage.top + this.currentPresentationMessage.getHeight();
        var presentationMessage = new PresentationMessage(this.idGenerator++, nextTop, syncMessage.from, syncMessage.to, syncMessage.message);
        for (var i in syncMessage.subMessages) {
            var oldCurrent = this.currentPresentationMessage;
            this.currentPresentationMessage = presentationMessage;
            var subSyncMessage = syncMessage.subMessages[i];
            var subPresentationMessage = subSyncMessage.accept(this);
            this.currentPresentationMessage.addSubMessage(subPresentationMessage);
            this.currentPresentationMessage = oldCurrent;
        }
        return presentationMessage;
    }
}

function PresentationBar(id, left, top, height, messageId) {
    this.id = id;
    this.left = left;
    this.height = height;
    this.top = top;
    this.messageId = messageId;

    this.extendByToBar = function(toBar) {
        var canvas = $('#bar_canvas_' + this.id)[0];

        this.clear();
        var barContext = canvas.getContext('2d');
        var newHeight = toBar.top + toBar.height - this.top + 3;
        if (newHeight > this.height) {
            this.height = newHeight;
        }
        var t0 = new Date().getTime();
        new BarDrawer().draw(barContext, this.left, this.top, this.height);//0~1ms
        var t1 = new Date().getTime();
//        $('#perf').text(t1 - t0);

        if (this.parentBar) this.parentBar.extendByToBar(this);
    };

    this.clear = function() {
        var canvas = $('#bar_canvas_' + this.id)[0];
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        //        canvas.width = canvas.width;
    };
}

function RichEntity(name, left, width) {
    this.name = name;
    this.left = left;
    this.width = width;
}

function PresentationMessage(id, top, fromEntity, toEntity, messageText) {
    this.id = id;
    this.top = top;
    this.height = 30;
    this.fromEntity = fromEntity;
    this.toEntity = toEntity;
    this.defaultBarHeight = 30;
    this.messageText = messageText;

    this.childrenMessages = new Array();

    this.addSubMessage = function (subPresentationMessage){
        this.childrenMessages.push(subPresentationMessage);
    };

    this.getChildrenHeight = function () {
        var childrenHeight = 0;
        for (var i in this.childrenMessages) {
            var childMessage = this.childrenMessages[i];
            childrenHeight += childMessage.getHeight();
        }
        return childrenHeight;
    };

    this.getHeight = function(){
        if (this.fromEntity == this.toEntity) this.height = 60;
        return this.height + this.getChildrenHeight();
    };

    this.getBarHeight = function() {
        var childrenHeight = this.getChildrenHeight();
        return this.defaultBarHeight + childrenHeight - 5;
    }
}
