angular.module('simplifield.dragndrop', [
]).factory('sfDragNDropService', function DragNDropService($interval) {
  var SESSION_KEYS = [
    'item', 'target', 'previous',
    'itemIndex', 'targetIndex', 'previousIndex', 'pos', "throw_back", "origin_item", "origin_element", "origin_position"
  ];
  sfDragNDropService = {
    session: {
        pos: {
          x: -1,
          y: -1
        },
      throw_back: false,
      origin_element: null,
      origin_position: null
    },
    reset: function reset() {
      Object.keys(sfDragNDropService.session).forEach(function(key) {
        if('type' == key) {
          sfDragNDropService.session.type = '';
        } else if('pos' == key) {
          //sfDragNDropService.session.pos.x = -1;
          //sfDragNDropService.session.pos.y = -1;
        } else if("throw_back" == key || "origin_item" == key || "origin_element" || "origin_position"){

        } else if (-1 !== SESSION_KEYS.indexOf(key)) {
          sfDragNDropService.session[key] = null;
        } else {
          delete sfDragNDropService.session[key];
        }
      });
    }
  };
  sfDragNDropService.reset();

  return sfDragNDropService;
}).directive("sfDrop", ['$parse', 'sfDragNDropService', '$interval',
  function DropDirective($parse, sfDragNDropService, $interval) {

  return {
    restrict: 'A',
    link: function($scope, element, attrs) {
      // Keep a ref to the dragged element
     	var item = $parse(attrs.sfDrop);
      // Setting callbacks
      var onDropCallback = $parse(attrs.sfOnDrop);
      var onDragEnterCallback = $parse(attrs.sfOnDragEnter);
      var onDragLeaveCallback = $parse(attrs.sfOnDragLeave);
      var onDragOverCallback = $parse(attrs.sfOnDragOver);
      // Bind drag events
      element.bind('dragenter', function(evt) {
        if(sfDragNDropService.session.type !== (attrs.sfDragType || 'all')) {
          return;
        }
        evt.preventDefault();

        sfDragNDropService.session.target = item($scope);
        sfDragNDropService.session.targetIndex = onDragEnterCallback($scope, {
          $type: sfDragNDropService.session.type,
          $item: sfDragNDropService.session.item,
          $itemIndex: sfDragNDropService.session.itemIndex,
          $target: sfDragNDropService.session.target,
          $targetIndex: sfDragNDropService.session.targetIndex,
          $session: sfDragNDropService.session
        });
        $scope.$apply();
      });
      element.bind('dragleave', function(evt) {
        if(sfDragNDropService.session.type !== (attrs.sfDragType || 'all')) {
          return;
        }
        evt.preventDefault();
        sfDragNDropService.session.previous = item($scope);
        sfDragNDropService.session.previousIndex = sfDragNDropService.session.targetIndex;
        onDragLeaveCallback($scope, {
          $type: sfDragNDropService.session.type,
          $item: sfDragNDropService.session.item,
          $itemIndex: sfDragNDropService.session.itemIndex,
          $previous: sfDragNDropService.session.previous,
          $previousIndex: sfDragNDropService.session.previousIndex,
          $session: sfDragNDropService.session
        });

        $scope.$apply();
      });
      element.bind('dragover', function(evt) {
        if(sfDragNDropService.session.type !== (attrs.sfDragType || 'all')) {
          return;
        }
        evt.preventDefault();
        sfDragNDropService.session.target = item($scope);
        onDragOverCallback($scope, {
          $type: sfDragNDropService.session.type,
          $item: sfDragNDropService.session.item,
          $itemIndex: sfDragNDropService.session.itemIndex,
          $target: sfDragNDropService.session.target,
          $targetIndex: sfDragNDropService.session.targetIndex,
          $previous: sfDragNDropService.session.target,
          $previousIndex: sfDragNDropService.session.targetIndex,
          $session: sfDragNDropService.session
        });
        $scope.$apply();
      });
      element.bind('drop', function(evt) {
        if(sfDragNDropService.session.type !== (attrs.sfDragType || 'all')) {
          return;
        }
        evt.preventDefault();
        sfDragNDropService.session.target = item($scope);
        onDropCallback($scope, {
          $type: sfDragNDropService.session.type,
          $item: sfDragNDropService.session.item,
          $itemIndex: sfDragNDropService.session.itemIndex,
          $target: sfDragNDropService.session.target,
          $targetIndex: sfDragNDropService.session.targetIndex,
          $previous: sfDragNDropService.session.previous,
          $previousIndex: sfDragNDropService.session.previousIndex,
          $session: sfDragNDropService.session
        });
        $scope.$apply();
      });
    }
  };

}]).directive('sfDrag', ['$parse', 'sfDragNDropService', '$interval',
  function DragDirective($parse, sfDragNDropService, $interval) {

  return {
    restrict: 'A',
    link: function($scope, element, attrs)  {
      // Keep a ref to the dragged model value
     	var item = $parse(attrs.sfDrag);

      // Try to get dragged datas
     	var getDragData = $parse(attrs.sfDragData);

      // Setting callbacks
      var dragGenerator = attrs.sfDragGenerator ?
        $parse(attrs.sfDragGenerator) :
        null;

      // Setting callbacks
      var onDragCallback = $parse(attrs.sfOnDrag);
      var onDragEndCallback = $parse(attrs.sfOnDragEnd);

      // Make the element draggable
      if(attrs.sfDraggable) {
        $scope.$watch(function() {
          return $parse(attrs.sfDraggable)($scope, {
            $type: sfDragNDropService.session.type,
            $item: sfDragNDropService.session.item,
            $itemIndex: sfDragNDropService.session.itemIndex,
            $session: sfDragNDropService.session
          });
        }, function(newVal, oldVal) {
          attrs.$set('draggable', (!!newVal).toString());
        });
      } else {
        attrs.$set('draggable', 'true');
      }
      var drg_c = 0;
      $(document).bind('drag', function(evt2){
        if((drg_c++ % 3) == 0  )
        $scope.$apply(function(){
          sfDragNDropService.session.pos.x = evt2.originalEvent.pageX;
          sfDragNDropService.session.pos.y = evt2.originalEvent.pageY;
        });
      });

      // Bind drag events
      element.bind('dragstart', function(evt) {
        var draggedItem = item($scope);
        function computeDragItem() {
           var itemIndex = onDragCallback($scope, {
            $item: draggedItem,
            $session: sfDragNDropService.session
          });
          if(-1 !== itemIndex) {
            sfDragNDropService.session.itemIndex = itemIndex;
            sfDragNDropService.session.item = draggedItem;
            sfDragNDropService.session.type = attrs.sfDragType || 'all';
            sfDragNDropService.session.mime = attrs.sfDragMime || 'text/plain';
            sfDragNDropService.session.data = getDragData($scope) || '' + itemIndex;

            evt.stopPropagation();
            (evt.dataTransfer || evt.originalEvent.dataTransfer)
              .setData(sfDragNDropService.session.mime, sfDragNDropService.session.data);
            (evt.dataTransfer || evt.originalEvent.dataTransfer)
              .effectAllowed = attrs.sfDragEffect || 'move';
          }
        }
        if(dragGenerator) {
          draggedItem = dragGenerator($scope, {
            $type: attrs.sfDragType || 'all',
            $item: draggedItem
          });
        }
        if(draggedItem.then) {
          draggedItem.then(function(value) {
            draggedItem = value;
            computeDragItem();
          });
        } else {
          computeDragItem();
        }
        $scope.$apply();
      });

      element.bind('dragend', function(evt) {

        onDragEndCallback($scope, {
          $type: sfDragNDropService.session.type,
          $item: sfDragNDropService.session.item,
          $itemIndex: sfDragNDropService.session.itemIndex,
          $previous: sfDragNDropService.session.previous,
          $previousIndex: sfDragNDropService.session.previousIndex,
          $session: sfDragNDropService.session
        });
        sfDragNDropService.reset();
        $scope.$apply();
      });
    }
  };
}]);

