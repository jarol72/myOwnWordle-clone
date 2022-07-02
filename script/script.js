import { words_5 } from "./words.js";

const d = document,
  letters = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ'],
    ['delete', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'check'],
  ],
positions = [],
$fragment = d.createDocumentFragment(),
$triesGrid = d.getElementById('triesGrid'),
$keyboard = d.getElementById('keyboard');

let tries = 0,
  $keys = undefined,
  answer = [],
  index,
  secretWord,
  $restart;

const resetBoard = () => {
  const $triesLetters = d.querySelectorAll('.triesGrid__letter');
  $triesLetters.forEach(tl => tl.classList.remove('green'));
  $triesLetters.forEach(tl => tl.classList.remove('yellow'));
  $triesLetters.forEach(tl => tl.classList.remove('lightgray'));
  $triesLetters.forEach(tl => tl.textContent = '');

  /* const $keyboardKeys = d.querySelectorAll('.keyboard__key');
  $keyboardKeys.forEach(k => k.disabled = false); */

  tries = 0;

  $keys.forEach(key => key.disabled = false);
  
  $restart.style.opacity = '0';
  answer = [];
}

const newGame = () => {
  if ($triesGrid.innerHTML === '' && $keyboard.innerHTML === '') {
    createTriesGrid();
    createKeyboard();
    $keys = d.querySelectorAll('.keyboard__key');
  } else {
    resetBoard();
  }
  index = Math.floor(Math.random() * words_5.length);
  secretWord = words_5[index].split('');
  console.log(secretWord);
};

// Create tries grid
const createTriesGrid = () => {
  for (let row = 0; row < 5; row++) {
    const $tryRow = d.createElement('section');
    $tryRow.classList.add('triesGrid__row');
    for (let col = 0; col < 5; col++) {
      const $tryLetter = d.createElement('button');
      $tryLetter.id = `${row}-${col}`;
      $tryLetter.classList.add('triesGrid__letter');
      $tryRow.appendChild($tryLetter);
    }
    $fragment.appendChild($tryRow);
  }
  $triesGrid.appendChild($fragment);
}

// Create keyboard
const createKeyboard = () => {
  letters.map(line => {
    let row = d.createElement("section");
    row.classList.add('keyboard__row')
    line.map(letter => {
      const $key = d.createElement('button');
      $key.textContent = letter;
      $key.id = letter;
      $key.classList.add('keyboard__key');
      row.appendChild($key);
    })
    $fragment.appendChild(row);
  });
  $keyboard.appendChild($fragment);
}

const disbleKeyboard = () => {
  $keys.forEach(key => key.disabled = true);
}

const showRestartButton = () => {
  $restart = d.querySelector('.restart');
  $restart.style.opacity = '1';
}

const typeLetter = (letter) => {
  const currentLetter = d.getElementById(`${tries}-${answer.length}`);
  currentLetter.textContent = letter;
}

const checkWord = () => {
  for (let i = 0; i < secretWord.length; i++) {
    const letter = d.getElementById(`${tries}-${i}`)
    if (answer[i] === secretWord[i]) {
      letter.classList.add('green');
    } else if (secretWord.includes(answer[i])) {
      letter.classList.add('yellow');
    } else {
      letter.classList.add('lightgray');
      let notUsed = d.getElementById(`${answer[i]}`);
      notUsed.disabled = true;
      console.log(notUsed);
    }
  }

  if (answer.join('') === secretWord.join('')) {
    setTimeout(() => {
      alert('Adivinaste la palabra!');
      $restart.focus();
    }, 250);
    
    disbleKeyboard();
    showRestartButton();
  };

  if (tries++ < 4) {
    answer = [];
  } else {
    alert('Lo siento, no adivinaste la palabra y ya no tienes más intentos');
    disbleKeyboard();
    showRestartButton();
  }
}

const deleteLetter = () => {
  if (answer.length) {
    let lastLetter = d.getElementById(`${tries}-${answer.length - 1}`);
    answer.pop();
    lastLetter.textContent = '';
  } else {
    alert('No hay letras para borrar');
  }
}

d.addEventListener('DOMContentLoaded', newGame);

d.addEventListener('click', (e) => {
  if (e.target.matches('#delete')) {
    deleteLetter();
  }

  if (e.target.matches('#check')) {
    checkWord();
  }

  if (e.target.matches('.keyboard__key')
    && !e.target.matches('#delete')
    && !e.target.matches('#check')) {
    if (answer.length < 5) {
      typeLetter(e.target.id);
      answer.push(e.target.id);
    } else {
      alert('palabra completa');
    }
  }

  if (e.target.matches('.restart')) {
    newGame();
    e.target.blur();
  }
});

d.addEventListener('keyup', e => {
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    if (answer.length < 5) {
      const key = d.getElementById(e.key);
      console.log(key)
      if (!key.disabled) {
        typeLetter(e.key);
        answer.push(e.key);
      }
    } else {
      alert('palabra completa');
    }
  }

  if (e.keyCode === 13 && answer.length > 0) {
    checkWord();
  }

  if (e.keyCode === 8 || e.keyCode === 46) {
    deleteLetter();
  }
});