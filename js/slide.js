console.clear();
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

let mainScroller = document.querySelector('.viewport-container');
let allSlides = gsap.utils.toArray(".slide-item");
let currentPanelInput = document.querySelector('.current-panel-input');
let totalPanelCount = allSlides.length;
let panelCount = document.querySelector('.panel-count');
panelCount.innerHTML = totalPanelCount;

// Set max attribute dynamically
currentPanelInput.setAttribute('max', totalPanelCount);

let prevArrow = document.querySelector(".prev-arrow");
let nextArrow = document.querySelector(".next-arrow");

// Remove fixed positioning and use normal flow
allSlides.forEach((slide, index) => {
  slide.style.position = 'relative';
  slide.style.zIndex = 100 - index;
});

// Create scroll triggers for each slide
allSlides.forEach((eachSlide, index) => {
  let realIndex = (index + 1);

  ScrollTrigger.create({
    trigger: eachSlide,
    scroller: ".viewport-container",
    start: "top 80%",
    end: "bottom 20%",
    onEnter: () => updateSlideCounter(realIndex),
    onEnterBack: () => updateSlideCounter(realIndex)
  });
});

function updateSlideCounter(slideNumber) {
  currentPanelInput.value = slideNumber;
  
  let indexNext = slideNumber + 1;
  let indexPrev = slideNumber - 1;
  
  nextArrow.setAttribute('data-down', indexNext);
  prevArrow.setAttribute('data-up', indexPrev);
  
  updateControls(indexPrev, indexNext);
}

function updateControls(keyIndexUp, keyIndexDown) {
  if (keyIndexUp >= 1) {
    prevArrow.classList.remove('disabled');
  } else {
    prevArrow.classList.add('disabled');
  }

  if (keyIndexDown <= totalPanelCount) {
    nextArrow.classList.remove('disabled');
  } else {
    nextArrow.classList.add('disabled');
  }
}

nextArrow.addEventListener("click", function(e) {
  e.preventDefault();
  let nextSlide = parseInt(this.getAttribute('data-down'));
  if (nextSlide <= totalPanelCount) {
    scrollToSlide(nextSlide);
  }
});

prevArrow.addEventListener("click", function(e) {
  e.preventDefault();
  let prevSlide = parseInt(this.getAttribute('data-up'));
  if (prevSlide >= 1) {
    scrollToSlide(prevSlide);
  }
});

function scrollToSlide(targetSlide) {
  gsap.to(mainScroller, {
    ease: "power2.inOut",
    duration: 0.8,
    scrollTo: {
      y: "#slide_" + targetSlide,
      autoKill: false
    }
  });
}

// Input field navigation - Go to slide when user types and presses Enter
currentPanelInput.addEventListener('keydown', function(e) {
  if (e.keyCode === 13) { // Enter key
    e.preventDefault();
    let targetSlide = parseInt(this.value);
    
    // Validate input
    if (targetSlide >= 1 && targetSlide <= totalPanelCount) {
      scrollToSlide(targetSlide);
      this.blur(); // Remove focus from input
    } else {
      // Reset to current slide if invalid
      this.value = parseInt(currentPanelInput.value);
    }
  }
});

// Input field navigation - Go to slide on blur (when clicking outside)
currentPanelInput.addEventListener('blur', function() {
  let targetSlide = parseInt(this.value);
  
  // Validate and navigate
  if (targetSlide >= 1 && targetSlide <= totalPanelCount) {
    scrollToSlide(targetSlide);
  } else {
    // Reset to current visible slide if invalid
    let currentSlideNum = parseInt(currentPanelInput.value);
    this.value = currentSlideNum;
  }
});

// Prevent invalid input - only allow numbers
currentPanelInput.addEventListener('input', function() {
  // Remove non-numeric characters
  this.value = this.value.replace(/[^0-9]/g, '');
  
  // Limit to max slide number
  if (parseInt(this.value) > totalPanelCount) {
    this.value = totalPanelCount;
  }
  
  // Prevent 0 or negative numbers
  if (parseInt(this.value) < 1 && this.value !== '') {
    this.value = 1;
  }
});

// Select all text when clicking on input
currentPanelInput.addEventListener('click', function() {
  this.select();
});

// Keyboard navigation with arrow keys
document.addEventListener('keydown', function(e) {
  // Don't trigger if user is typing in the input field
  if (document.activeElement === currentPanelInput) {
    return;
  }
  
  let currentSlideNum = parseInt(currentPanelInput.value);
  
  if (e.keyCode === 40 || e.keyCode === 34) {
    e.preventDefault();
    let nextSlide = currentSlideNum + 1;
    if (nextSlide <= totalPanelCount) {
      scrollToSlide(nextSlide);
    }
  }
  
  if (e.keyCode === 38 || e.keyCode === 33) {
    e.preventDefault();
    let prevSlide = currentSlideNum - 1;
    if (prevSlide >= 1) {
      scrollToSlide(prevSlide);
    }
  }
  
  if (e.keyCode === 36) {
    e.preventDefault();
    scrollToSlide(1);
  }
  
  if (e.keyCode === 35) {
    e.preventDefault();
    scrollToSlide(totalPanelCount);
  }
});


// Page Dropdown Navigation
let dropdownToggle = document.getElementById('dropdownToggle');
let dropdownMenu = document.getElementById('dropdownMenu');
let dropdownLinks = document.querySelectorAll('.dropdown-menu a');

// Toggle dropdown menu
dropdownToggle.addEventListener('click', function(e) {
  e.stopPropagation();
  dropdownMenu.classList.toggle('show');
  dropdownToggle.classList.toggle('active');
});

// Navigate to selected page
dropdownLinks.forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    let targetSlide = parseInt(this.getAttribute('data-slide'));
    
    // Close dropdown
    dropdownMenu.classList.remove('show');
    dropdownToggle.classList.remove('active');
    
    // Navigate to slide
    scrollToSlide(targetSlide);
  });
});

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
  if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
    dropdownMenu.classList.remove('show');
    dropdownToggle.classList.remove('active');
  }
});

// Update current page indicator in dropdown
function updateDropdownCurrentPage(slideNumber) {
  dropdownLinks.forEach(function(link) {
    let linkSlide = parseInt(link.getAttribute('data-slide'));
    if (linkSlide === slideNumber) {
      link.classList.add('current-page');
    } else {
      link.classList.remove('current-page');
    }
  });
}

// Call this inside updateSlideCounter function
// Modify your existing updateSlideCounter function:
function updateSlideCounter(slideNumber) {
  currentPanelInput.value = slideNumber;
  
  let indexNext = slideNumber + 1;
  let indexPrev = slideNumber - 1;
  
  nextArrow.setAttribute('data-down', indexNext);
  prevArrow.setAttribute('data-up', indexPrev);
  
  updateControls(indexPrev, indexNext);
  updateDropdownCurrentPage(slideNumber); // Add this line
}


// Initialize first state
updateSlideCounter(1);
