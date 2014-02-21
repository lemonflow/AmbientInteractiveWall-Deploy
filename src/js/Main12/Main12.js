var Main12 = (function () {
    
    function Main12(idx, r) {
        this.id = idx;
        this.operators = {
            overviewLayout: [],
            sphere: [],
            helix: [],
            grid: []
        };
        this.needsContinuousUpdate = false;
        this.controller = new Main12Controller();
    }
    
    Main12.prototype.init = function(scene) {
        this.controller.initController(document);
    };
    
    return Main12;
})();