document.addEventListener('DOMContentLoaded', function(event) {
  const readURL = input => {
    if (input.files && input.files[0]) {
      const reader = new FileReader()
      reader.onload = e => {
        const el = document.querySelector('#imagePreview')
        el.style.backgroundImage = `url(${e.target.result})`
      }
      reader.readAsDataURL(input.files[0])
    }
  }

  document.querySelector('#imageUpload').addEventListener('change', () => {
    readURL(document.querySelector('#imageUpload'))
  })

  paginator({
    table: document.getElementById("table"),
    box: document.getElementById("box"),
    active_class: 'active'
  })

  const cells = document.querySelectorAll("#table td input")

  for (let i = 0; i < cells.length; i++) { 
    cells[i].onclick = function(){
      if (this.classList.contains('is-static')) {
        this.classList.remove('is-static')
        this.readOnly = false
        saveEdits(this)
      }
    }
  }

  const saveEdits = (currentCell) => {
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].type === 'hidden') continue
      if (cells[i] === currentCell) continue
      if (!cells[i].classList.contains('is-static')) {
        cells[i].classList.add('is-static')
        cells[i].readOnly = true

        const result_id = cells[i].parentNode.parentNode.getAttribute('data-id')
        const change_type = cells[i].name;
        const change_value = cells[i].value;
        const csrf_token = cells[i].parentNode.parentNode.querySelector('input[type="hidden"]').value
        postData(`/results/${result_id}`, { csrf_token, type: change_type, value: change_value })
          .then(data => {
            cells[i].parentNode.classList.add('edited')
            setTimeout(() => {
              cells[i].parentNode.classList.remove('edited')
            }, 500);
          })
          .catch(error => {
            cells[i].parentNode.classList.add('edit-error')
            setTimeout(() => {
              cells[i].parentNode.classList.remove('edit-error')
            }, 500);
          })
      }
    }
  }

  const getCookie = (name) => {
    var value = "; " + document.cookie
    var parts = value.split("; " + name + "=")
    if (parts.length == 2) return parts.pop().split(";").shift()
  }

  const postData = (url = ``, data = {}) => {
      return fetch(url, {
          method: "POST",
          headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Accept": "application/json",
              "X-Requested-With": "XMLHttpRequest",
              "X-CSRF-Token": data.csrf_token
          },
          body: JSON.stringify(data),
      })
      .then(response => response.json())
  }

  document.addEventListener('click', function(event) {
    const match = '.table td *'
    if (!event.target.matches(match)) {
      saveEdits(null)
    }
  })
})

const deleteModal = (id, name) => {
  const modal = document.querySelector('.delete-result-modal');
  const html = document.querySelector('html');
  modal.classList.add('is-active');
  html.classList.add('is-clipped');

  document.getElementById('result_id').value = id;
  document.getElementById('result_name').innerHTML = name;

  modal.querySelector('.modal-background').addEventListener('click', function(e) {
    e.preventDefault();
    modal.classList.remove('is-active');
    html.classList.remove('is-clipped');
  });

  modal.querySelector('.button.is-danger').addEventListener('click', function(e) {
    e.preventDefault();
    modal.classList.remove('is-active');
    html.classList.remove('is-clipped');
  });
}
