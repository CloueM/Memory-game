// function to create falling leaves
export function createFallingLeaves() {
    var container = document.getElementById('leaves-container');
    var leafCount = 20; // number of leaves

    for (var i = 0; i < leafCount; i++) {
        var leaf = document.createElement('div');
        leaf.classList.add('leaf');
        
        // random position
        var left = Math.random() * 100;
        leaf.style.left = left + '%';
        
        // random size
        var size = Math.random() * 30 + 20; // 20px to 50px
        leaf.style.width = size + 'px';
        leaf.style.height = size + 'px';
        
        // random animation duration
        var duration = Math.random() * 10 + 5; // 5s to 15s
        leaf.style.animationDuration = duration + 's';
        
        // random delay
        var delay = Math.random() * 5;
        leaf.style.animationDelay = delay + 's';
        
        container.appendChild(leaf);
    }
}

// run on load
document.addEventListener('DOMContentLoaded', function() {
    createFallingLeaves();
});
