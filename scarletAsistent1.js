//Made by Antamansid
//only for Scarlet Project
//==============================
const axios = require('axios');
//==============================


//Настройки
console.log('Задаю настройки');
const yandexToken = 'AgAAAAAM3LnQAAY8G8i61maNgU0QmOmjBh5UNxA';
const gitToken = 'f9bdd6992b1fcc00250502b2f4467d4cb390c4f4';
const asistentScarlet = 'antamansid';
const orgId = 3586882;
//==============================

//Соответствие ников на гитхабе никам на Яндекс.Трекере
console.log('Задаю базу данных юзеров');
let users = [
  {
    name: 'Smirnov',
    gitName: 'antamansid',
    yaName: 'antamansid',
    yaId: '215792080'
  },
  {
    name: 'Mitchenko',
    gitName: 'mitchenko9',
    yaName: 'mitchenko-later',
    yaId: '996674156'
  },
  {
    name: 'Boyko',
    gitName: 'AndreyBoykRab',
    yaName: 'andrey-boyk-rab',
    yaId: '996746170'
  }
]
//==============================

//Стандартные параметры
console.log('Задаю стандартные параметры');
//Код запускается с помощью Node.js
//Стандартные параметры передаются коду посредством
//добавления их в строку вызова кода
//к примеру node index.js Tom 23
//В коде получаем массив process.argv, в котором
//[0] - путь к исполнителю 
//[1] - путь к исполняемому файлу
//[2] - соответственно Tom
//[3] - соответственно 23
//Сам файл в actions github запускается в следующем виде
//run: node scarletAsistentX.js ${{github.workflow}} ${{github.run_id}} ${{github.run_number}} ${{github.action}} ${{github.actor}} ${{github.repository}} ${{github.event_name}} ${{github.event_path}} ${{github.workspace}} ${{github.sha}} ${{github.ref}} ${{github.head_ref}} ${{github.base_ref}}
const gitWorkFlow = process.argv[2];    //название рабочей области, к примеру nodejs
const gitRunId = process.argv[3];    //айди запущенного ранера в git actions, к примеру 60895784
const gitRunNumber = process.argv[4];    //Сколько раз запускался ранер, к примеру 1
const gitAction = process.argv[5];    //Уникальный идентификатор action github
const gitActor = process.argv[6];    //ник того, кто запустил action, к примеру Antamansid
const gitRepository = process.argv[7];    //репозиторий того, кто запустил action, к примеру Antamansid/brusco
const gitEventName = process.argv[8];    //событие, которое было запущено, к примеру pull_request
const gitEventPath = process.argv[9];    //путь к событию, которое было запущено
const gitWorkspace = process.argv[10];   //workspace action-а github
const gitSha = process.argv[11];   //sha-код комита или пулреквеста или т.д.
const gitRef = process.argv[12];   //путь к пулреквесту или комиту или т.д., к примеру refs/pull/1/merge
const gitHeadRef = process.argv[13];   //название ветки при пулреквесте, к примеру scarlet3
const gitHeadBase = process.argv[14];   //название ветки куда все мержится при пулреквесте, к примеру master
//==============================

//Задача:
//Создается PR
console.log('Определяю порядок действий');
//1. Скрипт получает ссылку на PR
//2. Скрипт находит тикет на трекере по данному PR
//3. Скрипт получает информацию с трекера о ревьювере
//4. Скрипт на трекере добавляет комментарий к тикету со ссылкой на данный PR с призывом ревьювера
//5. Скрипт проставляет ревьювера в PR
//6. Скрипт переводит задачу в статус "ревью"

//Начнем с определения названия тикета и со ссылкой на PR
//Название тикета
//Согласно регламенту работы с веткой
//https://wiki.yandex.ru/users/mitchenko-later/Reglament-raboty-s-vetkojj/
//Пункт 2
//Ветка должна называться следующим образом:
//SCARLET-15_mitchenko9_added_scripts
//И это название хранится в переменной gitHeadRef (смотри выше)
const nameTicket = gitHeadRef.split('_')[0].toUpperCase();

//Теперь со ссылкой на PR
//Ссылка на PR выглядит следующим образом:
//https://github.com/mitchenko9/scarlet/pull/Х
//Где Х -номер PR
//Номер PR мы може получить из gitRef
const numPR = gitRef.split('/')[2];
const hrefGitPull = 'https://github.com/mitchenko9/scarlet/pull/' +  numPR;
//==============================

//1=============================
//Выполнили выше, получив hrefGitPull
console.log('Получил ссылку на RP');
//==============================

//2=============================
//инфа о тикете будет находиться по ссылке:
//https://api.tracker.yandex.net/v2/issues/ХХХХХХ
//где ХХХХХХ - nameTicket
const yaTicket = 'https://api.tracker.yandex.net/v2/issues/' + nameTicket;
console.log('Получил ссылку на тикет на трекере');
//==============================

//3=============================
console.log('Начинаю работу с трекером и репозиторием');
let revuersOnGit = [];
//Также получаем дату последнего обновления задачи - она нам понадобится
let lastDateUpdate = "";
console.log('Коннекчусь к трекеру');
axios.get(yaTicket,{
  headers:{
    Authorization : "OAuth "+yandexToken,
    'X-Org-Id': orgId 
  }
}).then((resp)=>{
  console.log('Получил данные с трекера');
  //Получили данные
  //Получаем дату
  lastDateUpdate = resp.data.lastCommentUpdatedAt;
  //Смотрим в ревьюверы и перебираем их
  resp.data.revuer.forEach((item, i, arr)=>{
    //ищем ревьювера в базе юзеров
    users.forEach((user, j, array)=>{
      //если нашли - добавляем в массив revuersOnGit
      //Сравнение не строгое!!!!
      if(item.id == user.yaId){
        revuersOnGit.push(user.gitName);
      }
    })
  });
  //4=============================
  //Постим комментарий со ссылкой на PR
  console.log('Постю комментарий на трекере со ссылкой на RP');
  axios.post('https://api.tracker.yandex.net/v2/issues/' + nameTicket + '/comments/_import', {
    "text": hrefGitPull,
    "createdAt": lastDateUpdate,
    "createdBy": asistentScarlet
  },{
    headers:{
      Authorization : "OAuth "+yandexToken,
      'X-Org-Id': orgId 
    }
  }).then((resp)=>{
    //5=============================
    console.log('Комментарий запостил');
    console.log('Проставляю ревьюверов в PR');
    //Проставляем ревьювера в PR
    axios.post('https://api.github.com/repos/mitchenko9/scarlet/pulls/'+numPR+'/requested_reviewers',
    {
      "reviewers": revuersOnGit
    },
    {
      headers:{
        authorization : "token "+ gitToken
      }
    }).then((resp)=>{
      console.log('Проставил ревьюверов в PR');
      //6=============================
      //Перевожу задачу в статус "ревью"
      console.log('Перевожу задачу в статус "ревью"');
      axios.post('https://api.tracker.yandex.net/v2/issues/' + nameTicket + '/transitions/inReview/_execute', 
      {
        headers:{
          Authorization : "OAuth "+yandexToken,
          'X-Org-Id': orgId 
        }
      }).then((resp)=>{
      console.log('Я все сделаль');
      })
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })

    //==============================
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  //==============================
})
.catch(function (error) {
  console.log(error);
})



