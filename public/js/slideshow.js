document.addEventListener("DOMContentLoaded", function(event) {
  const slide = document.querySelectorAll('.slider-single')
  const slideTotal = slide.length - 1
  let slideCurrent = -1

  const slideInitial = () => {
    // slide.classList.add('proactivede')
    for (let i = 0; i < slide.length; i++) {
      slide[i].classList.add('proactivede');
    }
    setTimeout(() => {
      slideLeft()
      slideRight()
    }, 500);
  }

  const slideRight = () => {
    let preactiveSlide, proactiveSlide;
    if (slideCurrent < slideTotal) {
      slideCurrent++
    } else {
      slideCurrent = 0
    }
    if (slideCurrent > 0) {
      preactiveSlide = slide[slideCurrent - 1]
    } else {
      preactiveSlide = slide[slideTotal]
    }
    let activeSlide = slide[slideCurrent]
    if (slideCurrent < slideTotal) {
      proactiveSlide = slide[slideCurrent + 1]
    } else {
      proactiveSlide = slide[0]
    }
    slide.forEach(thisSlide => {
      if (thisSlide.classList.contains('preactivede')) {
        thisSlide.classList.remove('preactivede', 'preactive', 'active', 'proactive')
        thisSlide.classList.add('proactivede')
      }
      if (thisSlide.classList.contains('preactive')) {
        thisSlide.classList.remove('preactive', 'active', 'proactive', 'proactivede')
        thisSlide.classList.add('preactivede')
      }
    })
    preactiveSlide.classList.remove('preactivede', 'active', 'proactive', 'proactivede')
    preactiveSlide.classList.add('preactive')
    activeSlide.classList.remove('preactivede', 'preactive', 'proactive', 'proactivede')
    activeSlide.classList.add('active')
    proactiveSlide.classList.remove('preactivede', 'preactive', 'active', 'proactivede')
    proactiveSlide.classList.add('proactive')
  }

  const slideLeft = () => {
    let proactiveSlide, preactiveSlide;
    if (slideCurrent > 0) {
      slideCurrent--
    } else {
      slideCurrent = slideTotal
    }

    if (slideCurrent < slideTotal) {
      proactiveSlide = slide[slideCurrent + 1]
    } else {
      proactiveSlide = slide[0]
    }
    let activeSlide = slide[slideCurrent]
    if (slideCurrent > 0) {
      preactiveSlide = slide[slideCurrent - 1]
    } else {
      preactiveSlide = slide[slideTotal]
    }
    slide.forEach(thisSlide => {
      if (thisSlide.classList.contains('proactivede')) {
        thisSlide.classList.remove('preactive', 'active', 'proactive', 'proactivede')
        thisSlide.classList.add('preactivede')
      }
      if (thisSlide.classList.contains('proactive')) {
        thisSlide.classList.remove('preactivede', 'preactive', 'active', 'proactive')
        thisSlide.classList.add('proactivede')
      }
    })
    preactiveSlide.classList.remove('preactivede', 'active', 'proactive', 'proactivede')
    preactiveSlide.classList.add('preactive')
    activeSlide.classList.remove('preactivede', 'preactive', 'proactive', 'proactivede')
    activeSlide.classList.add('active')
    proactiveSlide.classList.remove('preactivede', 'preactive', 'active', 'proactivede')
    proactiveSlide.classList.add('proactive')
  }

  document.querySelector('.slider-left').addEventListener('click', function(e) {
    slideLeft();
  });

  document.querySelector('.slider-right').addEventListener('click', function(e) {
    slideRight();
  });

  slideInitial();
})