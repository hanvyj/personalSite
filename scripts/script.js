// Constants
const roles = ['Software', 'Desktop', 'Web', '.NET'];
const switchTime = 2000;
let roleElement;
let oldRoleElement;

// Code goes here
document.addEventListener("DOMContentLoaded", ev => { 
  roleElement = document.getElementById('role');
  oldRoleElement = document.getElementById('old-role');
  
  switchRole();
  
  document.querySelectorAll('.employment-row')
    .forEach(el => {
      el.addEventListener("mouseenter", event => {
        var col1 = el.querySelector('.col1');
        var col2 = el.querySelector('.col2');
        var bar = el.querySelector('.col1 div');
        
        TweenMax.killTweensOf(col1);
        TweenMax.killTweensOf(col2);
        TweenMax.killTweensOf(bar);
        
        TweenLite.to(bar, 0.4, { opacity: 0 });
        TweenLite.to(col1, 0.4, { width: '40%' });
        TweenLite.set(col2,
          {
            opacity: 1,
            xPercent: 55,
          });
        TweenLite.to(col2, 0.4,
          {
            opacity: 1,
            xPercent: 0
          });
        
      })
      el.addEventListener("mouseleave", event => {
        var col1 = el.querySelector('.col1');
        var col2 = el.querySelector('.col2');
        var bar = el.querySelector('.col1 div');
        
        TweenMax.killTweensOf(col1);
        TweenMax.killTweensOf(col2);
        TweenMax.killTweensOf(bar);
        
        TweenLite.to(bar, 0.4, { opacity: 1 });
        TweenLite.to(col1, 0.4, { width: '100%' });
        TweenLite.to(col2, 0.4, {
          opacity: 0,
          xPercent: 55
        });
      })
    });
});

let role = 0;

function switchRole() {
  role = role >= roles.length - 1 ? 0 : role + 1;
  
  // roll switching
  if (oldRoleElement.lastChild) {
    oldRoleElement.removeChild(oldRoleElement.lastChild);
  }
  let lastChild = roleElement.lastChild;
  if (lastChild) {
    roleElement.removeChild(lastChild);
    oldRoleElement.appendChild(lastChild);
  }
  
  let h = document.createElement("H1");
  h.setAttribute("class", "display-4");
  h.setAttribute("id", "dev");
  let t = document.createTextNode(roles[role]);
  h.appendChild(t);
  roleElement.appendChild(h);
  
  TweenLite.set(roleElement, {
      opacity: 0,
      transform: 'translateY(-55px)',
    });
    
  TweenLite.to(roleElement, 0.5, {
      opacity: 1,
      transform: 'translateY(0)',
    });
      
  TweenLite.set(oldRoleElement, {
      opacity: 1,
      transform: 'translateY(0)',
    });
  
  TweenLite.to(oldRoleElement, 0.5, {
      opacity: 0,
      transform: 'translateY(55px)',
    });
    
  //loop
  setTimeout(switchRole, switchTime);
}


class Entity {
  constructor(ox, oy, x, y) {
    this.ox = ox;
    this.oy = oy;
    this.x = x;
    this.y = y;
    this.lastX = x;
    this.lastY = y;
    this.angle = Math.atan((y - oy) / (x - ox));
    this.dist = Math.sqrt((y - oy) * (y - oy) + (x - ox) * (x - ox))
    this.size = Math.random() * 3;
    this.alpha = Math.random() * 0.8;
    this.speed = Math.random() * 0.003;
    this.tail = (Math.random() * 0.3) + 0.2
    this.tailGradLength = Math.sin(this.tail) * this.dist;
  }
  
  draw(context) {
    context.beginPath();
    
    context.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
    context.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
    context.fill();
    
    //Create gradient
    context.arc(this.x, this.y, this.size*15, 0, 2 * Math.PI, false);
    context.fillStyle = `rgba(255, 255, 255, ${this.alpha * 0.05})`;
    context.fill();
    
    //Create gradient
    var gradient2 = context.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.tailGradLength);
    gradient2.addColorStop(0, `rgba(255, 255, 255, ${this.alpha * 0.6})`);
    gradient2.addColorStop(1, '#FFFFFF00');
    
    
    context.beginPath();
    context.arc(this.ox, this.oy, this.dist, this.angle - this.tail, this.angle);
    context.strokeStyle=gradient2;
    context.lineWidth=this.size * 1.8;
    context.stroke()
  }
  
  simulate() {
    this.angle += this.speed;
    
    this.lastX = this.x;
    this.lastY = this.y;
    
    this.x = this.ox + Math.cos(this.angle) * this.dist;
    this.y = this.oy + Math.sin(this.angle) * this.dist;
  }
}

var entities = [];
let starWidth = 0;
let starHeight = 0;

for (let i = 0; i < 500; i++) {
  entities.push(new Entity(100, 100,
    (Math.random() - 0.5) * 3000,
    (Math.random() - 0.5) * 2000));
}
function render() {
  const canvas = document.getElementById('canvas');
  var context = canvas.getContext("2d");
  
  // set size
  if (starWidth != canvas.offsetWidth || starHeight != canvas.offsetHeight)
  {
    starWidth = canvas.offsetWidth;
    starHeight = canvas.offsetHeight;
    canvas.width = starWidth;
    canvas.height = starHeight;
  }
  
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  for (var i = 0; i < entities.length ; i++) {
    entities[i].draw(context);
  }
}

// Animate.
function animate() {
  requestAnimationFrame(animate);
  render();
}

// Simulation loop
function simulate() {
  for (var i = 0; i < entities.length ; i++) {
    entities[i].simulate();
  }
  setTimeout(simulate, 1000/60)
}

window.requestAnimationFrame(animate)
simulate();