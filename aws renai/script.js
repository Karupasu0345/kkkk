const scenes = [
  { 
    name: 'カフェでの出会い', 
    dialogue: 'あなたはカフェで彼と軽く話している。どの飲み物を注文する？', 
    image: 'assets/images/cafe.jpg',  
    choices: ['コーヒー', '紅茶', 'ジュース'], 
    bgm: 'assets/music/cafe_bgm.mp3',  
    character: 'assets/images/character_male.png' 
  },
  { 
    name: '映画館', 
    dialogue: '映画を観る時間になった。どのジャンルの映画を観る？', 
    image: 'assets/images/movie.jpg',  
    choices: ['アクション', 'ロマンス', 'コメディ'], 
    bgm: 'assets/music/movie_bgm.mp3', 
    character: 'assets/images/character_male_thinking.png' 
  },
  { 
    name: 'モールでの買い物', 
    dialogue: 'ショッピングモールに来た。どのお店に行く？', 
    image: 'assets/images/mall.jpg',  
    choices: ['洋服店', 'レストラン', '本屋'], 
    bgm: 'assets/music/mall_bgm.mp3', 
    character: 'assets/images/character_male_shopping.png' 
  },
  { 
    name: '公園での散歩', 
    dialogue: '公園に着いた。どこに行こう？', 
    image: 'assets/images/park.jpg',  
    choices: ['噴水', 'ベンチ', 'カフェ'], 
    bgm: 'assets/music/park_bgm.mp3', 
    character: 'assets/images/character_male_park.png' 
  },
  { 
    name: 'ベンチでの告白', 
    dialogue: '夕暮れのベンチで、彼が緊張した様子であなたを見つめている。どうする？', 
    image: 'assets/images/beach.jpg',  
    choices: ['告白させる', '話題を変える'], 
    bgm: 'assets/music/bench_bgm.mp3', 
    character: 'assets/images/character_male_serious.png' 
  }
];

// ゲームの進行管理
let currentScene = 0;
let currentBGM = null;

// 音の管理用変数
const clickSound = new Howl({ src: ['assets/sound/click.mp3'], volume: 0.5 });
const successSound = new Howl({ src: ['assets/sound/success.mp3'], volume: 0.5 });
const failureSound = new Howl({ src: ['assets/sound/failure.mp3'], volume: 0.5 });

// スタート画面のスタートボタン
document.getElementById('startButton').addEventListener('click', () => {
  clickSound.play(); // スタートボタンの音
  document.getElementById('startScreen').style.display = 'none'; // スタート画面を非表示
  document.getElementById('app').style.display = 'flex';  // ゲームのメイン画面を表示
  renderScene(currentScene);  // 最初のシーンを描画
});

// BGMを再生する関数
function playBGM(bgmPath) {
  // 現在のBGMが再生中の場合は停止し、メモリを解放
  if (currentBGM) {
    currentBGM.stop();
    currentBGM.unload();
  }

  // 新しいBGMを初期化
  currentBGM = new Howl({
    src: [bgmPath],  // BGMのパスを指定
    volume: 0.5,
    loop: true,
    onload: () => {
      console.log(`BGM Loaded successfully: ${bgmPath}`);
      currentBGM.play();  // BGMを再生
    },
    onloaderror: (id, error) => {
      console.error(`Failed to load BGM: ${bgmPath}`, error);
    },
    onplayerror: (id, error) => {
      console.error(`Failed to play BGM: ${bgmPath}`, error);
    }
  });
}

// シーンの描画
function renderScene(sceneIndex) {
  const scene = scenes[sceneIndex];
  document.getElementById('characterName').innerText = scene.name;
  const dialogueTextElement = document.getElementById('dialogueText');
  typeText(dialogueTextElement, scene.dialogue, 50);

  // 背景画像を設定
  document.getElementById('app').style.backgroundImage = `url(${scene.image})`;
  document.getElementById('characterImage').src = scene.character;  // キャラクター画像を設定

  // シーンのBGMを再生
  console.log(`Switching to new scene: ${scene.name}`);
  playBGM(scene.bgm);

  const choicesHTML = scene.choices.map((choice, index) => `<button onclick="handleChoice(${index})">${choice}</button>`).join('');
  document.getElementById('choices').innerHTML = choicesHTML;
}

// テキストを1文字ずつ表示する関数
function typeText(element, text, speed) {
  element.textContent = "";  // 初期化
  let index = 0;

  function typeNext() {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(typeNext, speed);  // 指定されたスピードで次の文字を表示
    }
  }

  typeNext();
}

// 選択肢の処理
function handleChoice(choiceIndex) {
  clickSound.play(); // 選択肢を選んだときの音

  if (currentScene === scenes.length - 1) {
    // 最終シーン「ベンチ」で告白できる
    if (choiceIndex === 0) {  // 「告白させる」が選ばれた場合
      showModal('success');
    } else {
      showModal('failure');
    }
  } else {
    currentScene++;
    renderScene(currentScene);  // 次のシーンを描画
  }
}

// 結果を表示するモーダルウィンドウ
function showModal(type) {
  const modalOverlay = document.getElementById('modalOverlay');
  const modal = document.createElement('div');
  modal.classList.add('modal');

  if (type === 'success') {
    if (currentBGM) {
      currentBGM.fade(1.0, 0, 500);  // BGMをフェードアウト
      setTimeout(() => currentBGM.stop(), 500);
    }
    successSound.play();  // 成功音を再生

    modal.innerHTML = `
      <h2 style="font-size: 3em; color: #ff69b4;">告白成功！</h2>
      <p style="font-size: 1.5em;">彼は「ずっと君が好きだった。僕と付き合ってくれない？」と言ってきた。</p>
      <button onclick="closeModal()">OK</button>
    `;
  } else {
    if (currentBGM) {
      currentBGM.fade(1.0, 0, 500);  // BGMをフェードアウト
      setTimeout(() => currentBGM.stop(), 500);
    }
    failureSound.play();  // 失敗音を再生

    modal.innerHTML = `
      <h2>告白失敗...</h2>
      <p>彼は「ごめん、そんなつもりじゃなかったんだ」と言ってしまった。</p>
      <button onclick="closeModal()">OK</button>
    `;
  }

  document.body.appendChild(modal);
  modalOverlay.style.display = 'flex';
}

// モーダルを閉じる関数
function closeModal() {
  const modalOverlay = document.getElementById('modalOverlay');
  const modal = document.querySelector('.modal');
  modal.remove();
  modalOverlay.style.display = 'none';
}

// 初期シーンの描画
renderScene(currentScene);
