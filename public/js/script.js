
function toggleNav() {
    const overlay = document.getElementById('navOverlay');
    const arrow = document.getElementById('navArrow');
    if(overlay.classList.contains('active')) {
        overlay.classList.remove('active');
        arrow.style.transform = 'rotate(0deg)';
    } else {
        overlay.classList.add('active');
        arrow.style.transform = 'rotate(180deg)';
    }
}
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
if(toggleSwitch) {
    if(localStorage.getItem('theme') === 'light') { document.documentElement.setAttribute('data-theme', 'light'); toggleSwitch.checked = true; }
    toggleSwitch.addEventListener('change', (e) => {
        if(e.target.checked) { document.documentElement.setAttribute('data-theme', 'light'); localStorage.setItem('theme', 'light'); }
        else { document.documentElement.setAttribute('data-theme', 'dark'); localStorage.setItem('theme', 'dark'); }
    });
}
