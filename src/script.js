import './styles/style.scss';
import './contact';
import './roleSwitcher';

var svgNS = "http://www.w3.org/2000/svg";

// Articles
let articles;
let articleExpansions;
let focussedArticle;
let focussedArticleExpansion;

// Connections (as a 'dictionary')
let connections = {};
let connectorsSvg;

// Connections (as a 'dictionary')
let hovers;

document.addEventListener("DOMContentLoaded", ev => {
  // get an array of articles from the NodeList
  articles = [].slice.call(document.querySelectorAll(".article"));
  articleExpansions = [].slice.call(document.querySelectorAll(".article-extension"));
    
  // get connections
  connectorsSvg = document.getElementById('connectors');
  document.querySelectorAll(`[data-connect]`).forEach(el => {
    if (!connections[el.dataset.connect]) {
      const line = document.createElementNS(svgNS, 'path');
      line.setAttributeNS(null, "class", "connector")
      connectorsSvg.appendChild(line)
      connections[el.dataset.connect] = {
        elements: [],
        line
      };
    }
    connections[el.dataset.connect].elements.push(el);
  });
  
  // add all the hover events
  hovers = [].slice.call(document.querySelectorAll(`[data-hover]`)).map(el => ({
    source: el,
    target: document.getElementById(el.dataset.hover),
  }));
  
  hovers.forEach((h, i) => {
    if (h.target) {
      if (i > 0) {
        h.target.classList.add("d-none");
      }
      
      h.source.addEventListener("mouseenter", () => {
        // hide all
        hovers.forEach(h2 => {
          h2.target.classList.remove("d-block");
          h2.target.classList.add("d-none");
        })
        h.target.classList.remove("d-none");
        h.target.classList.add("d-block");
        redrawConnections();
      });
    }
  });
  
  update();
});

window.addEventListener("scroll", ev => {
  update();
});

window.addEventListener("resize", ev => {
  update();
});

function update() {
  // update focussed article
  const focusedArticle = getFocussedArticle();
  if (focusedArticle != null) {
    setFocussedArticle(focusedArticle);
  }
  
  // redraw connections
  redrawConnections();
}

function redrawConnections() {
  Object.keys(connections).forEach(connectionName => {
    const connection = connections[connectionName];
    
    if (connection.elements.length < 2 ||
      connection.elements[0].offsetParent === null ||
      connection.elements[1].offsetParent === null ||
      connection.elements[0].style.opacity === '0' ||
      connection.elements[1].style.opacity === '0') {
      connection.line.style.display = "none";
      return;
    }
    connection.line.style.display = "block";
    
    const sourceRect = connection.elements[0].getBoundingClientRect();
    const targetRect = connection.elements[1].getBoundingClientRect();
    
    connection.line.setAttributeNS(null, 'd', generatePath(
      connection.elements[0].dataset.placement === 'left' ? sourceRect.left - 10 : sourceRect.right + 10,
      sourceRect.top + (connection.elements[0].offsetHeight / 2),
      connection.elements[1].dataset.placement === 'left' ? targetRect.left - 10 : targetRect.right + 10,
      targetRect.top + (connection.elements[1].offsetHeight / 2)));
  });
}

function generatePath(x1, y1, x2, y2) {
  const width = x2 - x1;
  return `M${x1} ${y1} C ${x1 + width*0.7} ${y1}, ${x2 - width*0.7} ${y2}, ${x2} ${y2}`;
}

function getFocussedArticle() {
  console.log(articles);
  return articles.find(article => {
    const rect =  article.getBoundingClientRect();

    const viewPortCenter = window.innerHeight/2;
    
    console.log(article.id, article.getBoundingClientRect());

    return viewPortCenter > rect.top && viewPortCenter < rect.bottom;
  });
}

function setFocussedArticle(article) {
  if (focussedArticle !== article) {
    let oldFocussedArticleExpansion = focussedArticleExpansion;
    
    focussedArticle = article;
    focussedArticleExpansion = document.querySelector(`.article-extension[data-for='${focussedArticle.id}']`);
    
    articleExpansions.forEach(ae => {
      TweenMax.killTweensOf(ae);
      TweenLite.set(ae, {
        opacity: 0,
        transform: 'translateY(-55px)',
        display: 'none',
      });
    });
    
    if (oldFocussedArticleExpansion != null) {      
      TweenLite.set(oldFocussedArticleExpansion, {
        opacity: 1,
        transform: 'translateY(0)',
        display: 'flex',
        });
      redrawConnections()
      
      TweenLite.to(oldFocussedArticleExpansion, 0.2, {
        opacity: 0,
        transform: 'translateY(55px)',
        display: 'none',
        onComplete: () => {
          TweenLite.set(focussedArticleExpansion, {
            opacity: 0,
            transform: 'translateY(-55px)',
            display: 'none',
          });
          redrawConnections()
          
          TweenLite.to(focussedArticleExpansion, 0.2, {
            opacity: 1,
            transform: 'translateY(0)',
            display: 'flex',
            onComplete: () => redrawConnections()
          });
        }
      });
    } else {
      TweenLite.set(focussedArticleExpansion, {
        opacity: 0,
        transform: 'translateY(-55px)',
        display: 'none',
        onComplete: () => redrawConnections()
      });
      redrawConnections()
      
      TweenLite.to(focussedArticleExpansion, 0.2, {
        opacity: 1,
        transform: 'translateY(0)',
        display: 'flex',
        onComplete: () => redrawConnections()
      });
    }
  }
}
