const wand = document.getElementById("wand"),
      tiles = document.querySelectorAll(".tile");

const xy = (x, y) => ({ x, y }),
      px = value => `${value}px`,
      deg = value => `${value}deg`,
      clamp = (value, min, max) => Math.max(Math.min(value, max), min);

const updateMouse = (mouseX, mouseY) => {
  const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
  
  const mouse = {
    position: xy(mouseX, mouseY),
    decimal: xy(mouseX / windowWidth, mouseY / windowHeight),
    multiplier: xy(1.3, 0.4),
    offset: xy(windowWidth * -0.15, windowHeight * 0.1),
    modifiedPosition: xy(0, 0)
  }
  
  mouse.modifiedPosition.x = mouse.position.x * mouse.multiplier.x + mouse.offset.x;  
  mouse.modifiedPosition.y = mouse.position.y * mouse.multiplier.y + mouse.offset.y;  
  
  return mouse;
}

const revealImages = mouseX => {
  for(const tile of tiles) {
    const dimensions = tile.getBoundingClientRect(),
          relativeMouseX = mouseX - dimensions.left,
          mouseXAsDecimal = clamp(relativeMouseX / dimensions.width, 0, 1);
    
    const opacity = mouseXAsDecimal,
          blur = 1 - mouseXAsDecimal;
    
    tile.style.setProperty("--opacity", opacity);
    tile.style.setProperty("--blur", blur);
  }
}

const getWandStyles = mouse => ({
  left: px(mouse.modifiedPosition.x),
  top: px(mouse.modifiedPosition.y),
  rotate: deg(mouse.decimal.x * 20 - 10)
});

window.onmousemove = e => {
  const mouse = updateMouse(e.clientX, e.clientY),  
        wandStyles = getWandStyles(mouse);
  
  wand.animate(wandStyles, { duration: 400, fill: "forwards" });
  
  revealImages(mouse.modifiedPosition.x);
}


//ANIMATED TEXT -- TEXTO ANIMADO 
var TxtType = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

    var that = this;
    var delta = 200 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
    }

    setTimeout(function() {
    that.tick();
    }, delta);
};

window.onload = function() {
    var elements = document.getElementsByClassName('typewrite');
    for (var i=0; i<elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
          new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
    document.body.appendChild(css);
};