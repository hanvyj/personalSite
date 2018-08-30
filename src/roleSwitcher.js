const roles = ['Software', 'Desktop', 'Web', '.NET'];
const switchTime = 2000;
let roleSwitchers = [];
let role = 0;

document.addEventListener("DOMContentLoaded", ev => {
  // start role switching
  roleSwitchers = [].slice.call(document.querySelectorAll(".role-switcher")).map(el => ({
    roleElement: el.querySelector('.role'),
    oldRoleElement: el.querySelector('.old-role'),
    class: el.dataset.roleclass
  }));
  
  switchRole();
});

function switchRole() {
  role = role >= roles.length - 1 ? 0 : role + 1;

  const onComplete = (() => {
    let executed = false;
    return function() {
        if (!executed) {
            executed = true;
            setTimeout(switchRole, switchTime);
        }
    };
  })();

  roleSwitchers.forEach(roleSwitcher => {
    if (roleSwitcher.oldRoleElement.lastChild) {
      roleSwitcher.oldRoleElement.removeChild(roleSwitcher.oldRoleElement.lastChild);
    }
    let lastChild = roleSwitcher.roleElement.lastChild;
    if (lastChild) {
      roleSwitcher.roleElement.removeChild(lastChild);
      roleSwitcher.oldRoleElement.appendChild(lastChild);
    }
    
    let h = document.createElement("H1");
    if (roleSwitcher.class) {
      h.setAttribute("class", roleSwitcher.class);
    }
    h.setAttribute("id", "dev");
    let t = document.createTextNode(roles[role]);
    h.appendChild(t);
    roleSwitcher.roleElement.appendChild(h);
    
    TweenLite.set(roleSwitcher.roleElement, {
        opacity: 0,
        transform: 'translateY(-55px)',
      });
      
    TweenLite.to(roleSwitcher.roleElement, 0.5, {
        opacity: 1,
        transform: 'translateY(0)',
      });
        
    TweenLite.set(roleSwitcher.oldRoleElement, {
        opacity: 1,
        transform: 'translateY(0)',
      });
    
    TweenLite.to(roleSwitcher.oldRoleElement, 0.5, {
        opacity: 0,
        transform: 'translateY(55px)',
        onComplete: onComplete
      });
  });
}