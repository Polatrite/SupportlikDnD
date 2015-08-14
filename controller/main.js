var app = angular.module("main_app", ['dragInventory']);
app.controller("main_controller", function ($scope) {
    $scope.name = "main";

    $scope.inv = new Inventory(50, [], []);
    $scope.inv2 = new Inventory(50, [], ["enchanted"]);
    $scope.back_pack = new Inventory(9, [], []);
    $scope.chest = new Inventory(10, [], []);
    $scope.weapon_not_enchanted = new Inventory(4, ['weapon'], ['enchanted']);
    $scope.weapon_enchanted = new Inventory(4, ['weapon', 'enchanted'], ['axe']);
    var sprite = "https://i.imgur.com/ngGK5MF.png";

    $scope.inv.add_item(new Item("Sword", ["item", "weapon", "sword"], 0, -170, sprite));
    $scope.inv.add_item(new Item("Sword", ["item", "weapon", "sword"], 0, -170, sprite));
    $scope.inv.add_item(new Item("Fire Sword", ["item", "weapon", "sword", "enchanted"], -34, -952, sprite));
    $scope.inv.add_item(new Item("Axe", ["item", "weapon", "axe"], -170, -340, sprite));
    $scope.inv.add_item(new Item("Fire Axe", ["item", "weapon", "axe", "enchanted"], -306, -340, sprite));

    $scope.r1 = 5;
    $scope.c1 = 5;
});


