document.addEventListener('DOMContentLoaded', function () {
  lucide.createIcons();

  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIconOpen = document.getElementById('menu-icon-open');
  const menuIconClose = document.getElementById('menu-icon-close');
  let menuOpen = false;

  function toggleMenu() {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('active', menuOpen);
    menuIconOpen.style.display = menuOpen ? 'none' : 'block';
    menuIconClose.style.display = menuOpen ? 'block' : 'none';
  }

  mobileMenuBtn.addEventListener('click', toggleMenu);

  document.querySelectorAll('[data-scroll-to]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.getElementById(el.getAttribute('data-scroll-to'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      if (menuOpen) toggleMenu();
    });
  });

  var selectedRating = 0;
  var starButtons = document.querySelectorAll('.star-rating-input button');

  function updateStars(rating) {
    starButtons.forEach(function (btn, idx) {
      var svg = btn.querySelector('i');
      if (idx < rating) {
        svg.classList.add('star-filled');
        svg.classList.remove('star-empty');
        svg.setAttribute('data-lucide', 'star');
        svg.setAttribute('fill', 'currentColor');
      } else {
        svg.classList.remove('star-filled');
        svg.classList.add('star-empty');
        svg.setAttribute('data-lucide', 'star');
        svg.removeAttribute('fill');
      }
    });
    lucide.createIcons();
  }

  starButtons.forEach(function (btn, idx) {
    btn.addEventListener('click', function () {
      selectedRating = idx + 1;
      updateStars(selectedRating);
    });
  });

  var reviewForm = document.getElementById('review-form');
  reviewForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var nameInput = document.getElementById('review-name');
    var commentInput = document.getElementById('review-comment');
    var name = nameInput.value.trim();
    var comment = commentInput.value.trim();

    if (!name || name.length < 2) {
      showToast('الاسم يجب أن يكون حرفين على الأقل');
      return;
    }
    if (selectedRating < 1) {
      showToast('يجب اختيار تقييم');
      return;
    }
    if (!comment || comment.length < 5) {
      showToast('التعليق يجب أن يكون 5 أحرف على الأقل');
      return;
    }

    var reviewsGrid = document.getElementById('reviews-grid');
    var newCard = document.createElement('div');
    newCard.className = 'card review-card';
    
    var starsHtml = '';
    for (var i = 1; i <= 5; i++) {
      if (i <= selectedRating) {
        starsHtml += '<i data-lucide="star" class="star-filled" fill="currentColor"></i>';
      } else {
        starsHtml += '<i data-lucide="star" class="star-empty"></i>';
      }
    }

    newCard.innerHTML =
      '<div class="review-header">' +
        '<span class="review-name">' + escapeHtml(name) + '</span>' +
        '<div class="review-stars">' + starsHtml + '</div>' +
      '</div>' +
      '<p class="review-text">' + escapeHtml(comment) + '</p>';

    reviewsGrid.insertBefore(newCard, reviewsGrid.firstChild);
    lucide.createIcons();

    nameInput.value = '';
    commentInput.value = '';
    selectedRating = 0;
    updateStars(0);

    showToast('تم إرسال تقييمك بنجاح!');
  });

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  var toastEl = document.getElementById('toast');
  var toastTimeout;

  function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function () {
      toastEl.classList.remove('show');
    }, 3000);
  }
});
