let map;

const editor = document.getElementById('editor');
let theme = INITIAL_STYLE;

function createMap(theme) {
  map = undefined;
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: new google.maps.LatLng(-16.6868824, -49.26478849),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    fullscreenControl: true,
    streetViewControl: false,
    styles: theme,
  });
}

function initEditor() {
  let colorInput;
  let colorOutput;
  let holder;
  let textColorInput;

  let sectionTitle = document.createElement('div');
  sectionTitle.innerText = '► Colors:';
  sectionTitle.className = 'section-title';
  editor.innerHTML = '';
  editor.appendChild(sectionTitle);
  map.styles.filter(s => s.stylers[0].color).forEach(s => {
    colorInput = document.createElement('input');
    colorInput.style.display = 'none';
    colorInput.type = 'color';
    colorInput.value = s.stylers[0].color;
    colorInput.onchange = ($event) => {
      makeTheme();
      $event.target.parentElement
        .querySelector('span')
        .style.color = $event.target.value;
      $event.target.parentElement
        .querySelector('b')
        .innerText = $event.target.value;
    };

    textColorInput = document.createElement('b');
    textColorInput.innerText = colorInput.value;
    textColorInput.onclick = ($event) => {
      $event.target.parentElement
        .querySelector('input[type="color"]')
        .click();
    }

    colorOutput = document.createElement('span');
    colorOutput.innerText = '⬤';
    colorOutput.style.color = s.stylers[0].color;
    colorOutput.onclick = ($event) => {
      $event.target.parentElement
        .querySelector('input[type="color"]')
        .click();
    }

    holder = document.createElement('span');
    holder.appendChild(colorInput);
    holder.appendChild(textColorInput);
    holder.appendChild(colorOutput);
    editor.appendChild(holder);
    editor.appendChild(document.createElement('br'));
  });
}

function makeTheme() {
  theme = map.styles;
  editor.querySelectorAll('input[type="color"]').forEach((input, index) => {
    theme[index].stylers[0].color = input.value;
  });
  createMap(theme);
}

window.onload = () => {
  createMap(INITIAL_STYLE);
  initEditor();
};

let insertModal = document.getElementById('insert-json-modal');

document.getElementById('copy').onclick = copyJSON;
document.getElementById('insert').onclick = () => {
  document.querySelector('.nav-bar').className = 'nav-bar blur-out';
  document.getElementById('editor').className = 'blur-out';
  insertModal.style.display = 'block';
};

document.getElementById('cancel').onclick = closeModal;

document.getElementById('confirm').onclick = () => {
  let input = document.getElementById('insert-json-input');
  if (input.value) {
    let value = JSON.parse(input.value);
    if (value instanceof Array) {
      createMap(value);
      makeTheme();
      initEditor();
      closeModal();
    } else {
      alert('The input data does not seems to be an Array value. ' +
        'Please, visit Google Maps developer documentations for more details.');
    }
  } else {
    alert('The input data does not seems to be an Array value. ' +
      'Please, visit Google Maps developer documentations for more details.');
  }
};

function closeModal() {
  document.querySelector('.nav-bar').className = 'nav-bar blur-in';
  document.getElementById('editor').className = 'blur-in';
  insertModal.style.display = 'none';
}

function copyJSON($event) {
  let originalClass = $event.target.className;
  let originalText = $event.target.innerText;

  const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  $event.target.className += ' loading';
  copyToClipboard(JSON.stringify(theme));

  setTimeout(() => {
    $event.target.innerText = 'DONE ✓';
  }, 300);

  setTimeout(() => {
    $event.target.className = originalClass;
    $event.target.innerText = originalText;
  }, 1500);
}
