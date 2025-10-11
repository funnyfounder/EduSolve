// /assets/scripts.js
document.addEventListener('DOMContentLoaded', () => {
  feather.replace();

  // Mobile nav toggle
  const toggle = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('mobile-close');
  toggle.addEventListener('click', () => drawer.classList.add('open'));
  closeBtn.addEventListener('click', () => drawer.classList.remove('open'));

  // Load header & footer
  ['header', 'footer'].forEach(id => {
    fetch(`/components/${id}.html`)
      .then(res => res.text())
      .then(html => document.getElementById(id).innerHTML = html);
  });

  // Pricing toggle
  const billing = document.getElementById('billing-toggle');
  billing.addEventListener('change', () => {
    document.querySelectorAll('.price').forEach(el => {
      const monthly = el.dataset.monthly;
      const yearly = el.dataset.yearly;
      el.textContent = '$' + (billing.checked ? yearly : monthly);
    });
  });

  // Ask Question form
  const form = document.getElementById('question-form');
  const respArea = document.getElementById('response-area');
  const spinner = document.getElementById('spinner');
  const solCard = document.getElementById('solution-card');
  const solText = document.getElementById('solution-text');
  const stepsList = document.getElementById('steps-list');
  const toggleSteps = document.getElementById('toggle-steps');
  form.addEventListener('submit', e => {
    e.preventDefault();
    respArea.classList.remove('hidden');
    spinner.classList.remove('hidden');
    solCard.classList.add('hidden');
    // simulate API
    setTimeout(() => {
      spinner.classList.add('hidden');
      solCard.classList.remove('hidden');
      solText.textContent = 'This is a simulated solution content.';
      const steps = ['Step one explanation.', 'Step two explanation.', 'Final step explanation.'];
      stepsList.innerHTML = steps.map(s => `<li>${s}</li>`).join('');
    }, 1500);
  });
  toggleSteps.addEventListener('click', () => {
    stepsList.classList.toggle('hidden');
    toggleSteps.textContent = stepsList.classList.contains('hidden') ? 'Show Steps' : 'Hide Steps';
  });
});
