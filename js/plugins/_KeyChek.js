//=============================================================================
// _KeyChek.js
//=============================================================================

/*:
 * @plugindesc One more menu for making keys.
 * @author Antamansid for ScarletProject
 *
 * @help This plugin does not provide plugin commands.
 */

(function() {
  //Для начала надо объявить новые тексты
  //Их кстати надо задать в разных языках!
  //Инфа берется из data/System.json из массива commands
  //Но мы создадим собственный массив, потому как при загрузке плагинов
  //$dataSystem еще не подгружен (((
  //Это делается для того, чтобы в будущем можно было решить вопрос с многоЯзыковостью - Во сказанул а?
  var $newCommands = []
  $newCommands[1] = "Опции игры";
  $newCommands[2] = "Опции клавиш";
  $newCommands[3] = "Вверх";
  $newCommands[4] = "Вниз";
  $newCommands[5] = "Влево";
  $newCommands[6] = "Вправо";
  $newCommands[7] = "Нажмите клавишу";
  $newCommands[8] = "Взаимодействие";

  //Выходя из вышеописанного приходится создавать новую функцию
  TextManager.newCommand = function(commandId) {
    return $newCommands[commandId] || '';
};

  //Теперь определим новый свойства TextManager-у - менеджеру, который работает со всеми текстами в игре
  //Соответственно задаем ему соответствие полей из $newCommands к полям к обработке
  //Нужна больше инфа? смотри в rpg_managers.js строчку 1657 "TextManager.command"
  Object.defineProperties(TextManager, {
    optionGame      : TextManager.getter('newCommand', 1),
    optionKeys      : TextManager.getter('newCommand', 2),
    keyUp           : TextManager.getter('newCommand', 3),
    keyDown         : TextManager.getter('newCommand', 4),
    keyLeft         : TextManager.getter('newCommand', 5),
    keyRight        : TextManager.getter('newCommand', 6),
    pressButtonKey  : TextManager.getter('newCommand', 7),
    interaction     : TextManager.getter('newCommand', 8)
  });

  //Редактируем Окна!!!
  //Теперь редактируем окно опции
  //Оно будет разделяться на 2 меню-подопции
  //Меню игры и Менб клавишь
  //Сначала редактируем само окно опций
  //В частности нам надо отредактировать только makeCommandList
  //Тем самым мы спускаем все с 2673 до 2782 js/rpg_windows.js в унита..... в другой объект)))
  //В объект Window_OptionGame

  function Window_Options() {
    this.initialize.apply(this, arguments);
  }

  Window_Options.prototype = Object.create(Window_Command.prototype);
  Window_Options.prototype.constructor = Window_Options;

  Window_Options.prototype.initialize = function() {
      Window_Command.prototype.initialize.call(this, 0, 0);
      this.updatePlacement();
  };

  Window_Options.prototype.windowWidth = function() {
      return 400;
  };

  Window_Options.prototype.windowHeight = function() {
      return this.fittingHeight(Math.min(this.numVisibleRows(), 12));
  };

  Window_Options.prototype.updatePlacement = function() {
      this.x = (Graphics.boxWidth - this.width) / 2;
      this.y = (Graphics.boxHeight - this.height) / 2;
  };

  Window_Options.prototype.makeCommandList = function() {
      this.addGenOptions();
  };

  Window_Options.prototype.addGenOptions = function() {    
      this.addCommand(TextManager.optionGame,   'optionGame');
      this.addCommand(TextManager.optionKeys,   'optionKeys');
  };

  //Теперь Окно опции игры, которое раньше было просто Window_Option
  //Ничего примечательного....

  //-----------------------------------------------------------------------------
  // Window_OptionGame
  //
  // The window for displaying game options.
  function Window_OptionGame() {
    this.initialize.apply(this, arguments);
  }

  Window_OptionGame.prototype = Object.create(Window_Command.prototype);
  Window_OptionGame.prototype.constructor = Window_OptionGame;

  Window_OptionGame.prototype.initialize = function() {
      Window_Command.prototype.initialize.call(this, 0, 0);
      this.updatePlacement();
  };

  Window_OptionGame.prototype.windowWidth = function() {
      return 400;
  };

  Window_OptionGame.prototype.windowHeight = function() {
      return this.fittingHeight(Math.min(this.numVisibleRows(), 12));
  };

  Window_OptionGame.prototype.updatePlacement = function() {
      this.x = (Graphics.boxWidth - this.width) / 2;
      this.y = (Graphics.boxHeight - this.height) / 2;
  };

  Window_OptionGame.prototype.makeCommandList = function() {
      this.addGeneralOptions();
      this.addVolumeOptions();
  };

  Window_OptionGame.prototype.addGeneralOptions = function() {
      this.addCommand(TextManager.alwaysDash, 'alwaysDash');
      this.addCommand(TextManager.commandRemember, 'commandRemember');
  };

  Window_OptionGame.prototype.addVolumeOptions = function() {
      this.addCommand(TextManager.bgmVolume, 'bgmVolume');
      this.addCommand(TextManager.bgsVolume, 'bgsVolume');
      this.addCommand(TextManager.meVolume, 'meVolume');
      this.addCommand(TextManager.seVolume, 'seVolume');
  };

  Window_OptionGame.prototype.drawItem = function(index) {
      var rect = this.itemRectForText(index);
      var statusWidth = this.statusWidth();
      var titleWidth = rect.width - statusWidth;
      this.resetTextColor();
      this.changePaintOpacity(this.isCommandEnabled(index));
      this.drawText(this.commandName(index), rect.x, rect.y, titleWidth, 'left');
      this.drawText(this.statusText(index), titleWidth, rect.y, statusWidth, 'right');
  };

  Window_OptionGame.prototype.statusWidth = function() {
      return 120;
  };

  Window_OptionGame.prototype.statusText = function(index) {
      var symbol = this.commandSymbol(index);
      var value = this.getConfigValue(symbol);
      if (this.isVolumeSymbol(symbol)) {
          return this.volumeStatusText(value);
      } else {
          return this.booleanStatusText(value);
      }
  };

  Window_OptionGame.prototype.isVolumeSymbol = function(symbol) {
      return symbol.contains('Volume');
  };

  Window_OptionGame.prototype.booleanStatusText = function(value) {
      return value ? 'ON' : 'OFF';
  };

  Window_OptionGame.prototype.volumeStatusText = function(value) {
      return value + '%';
  };

  Window_OptionGame.prototype.processOk = function() {
      var index = this.index();
      var symbol = this.commandSymbol(index);
      var value = this.getConfigValue(symbol);
      if (this.isVolumeSymbol(symbol)) {
          value += this.volumeOffset();
          if (value > 100) {
              value = 0;
          }
          value = value.clamp(0, 100);
          this.changeValue(symbol, value);
      } else {
          this.changeValue(symbol, !value);
      }
  };

  Window_OptionGame.prototype.cursorRight = function(wrap) {
      var index = this.index();
      var symbol = this.commandSymbol(index);
      var value = this.getConfigValue(symbol);
      if (this.isVolumeSymbol(symbol)) {
          value += this.volumeOffset();
          value = value.clamp(0, 100);
          this.changeValue(symbol, value);
      } else {
          this.changeValue(symbol, true);
      }
  };

  Window_OptionGame.prototype.cursorLeft = function(wrap) {
      var index = this.index();
      var symbol = this.commandSymbol(index);
      var value = this.getConfigValue(symbol);
      if (this.isVolumeSymbol(symbol)) {
          value -= this.volumeOffset();
          value = value.clamp(0, 100);
          this.changeValue(symbol, value);
      } else {
          this.changeValue(symbol, false);
      }
  };

  Window_OptionGame.prototype.volumeOffset = function() {
      return 20;
  };

  Window_OptionGame.prototype.changeValue = function(symbol, value) {
      var lastValue = this.getConfigValue(symbol);
      if (lastValue !== value) {
          this.setConfigValue(symbol, value);
          this.redrawItem(this.findSymbol(symbol));
          SoundManager.playCursor();
      }
  };

  Window_OptionGame.prototype.getConfigValue = function(symbol) {
      return ConfigManager[symbol];
  };

  Window_OptionGame.prototype.setConfigValue = function(symbol, volume) {
      ConfigManager[symbol] = volume;
  };

  //Теперь окно с опциями клавишь
  //Также ничего примечательного....

  //-----------------------------------------------------------------------------
  // Window_OptionKey
  //
  // The window for displaying key options.
  function Window_OptionKey() {
    this.initialize.apply(this, arguments);
  }

  Window_OptionKey.prototype = Object.create(Window_Command.prototype);
  Window_OptionKey.prototype.constructor = Window_OptionKey;

  Window_OptionKey.prototype.initialize = function() {
      Window_Command.prototype.initialize.call(this, 0, 0);
      this.updatePlacement();
  };

  Window_OptionKey.prototype.windowWidth = function() {
      return 400;
  };

  Window_OptionKey.prototype.windowHeight = function() {
      return this.fittingHeight(Math.min(this.numVisibleRows(), 12));
  };

  Window_OptionKey.prototype.updatePlacement = function() {
      this.x = (Graphics.boxWidth - this.width) / 2;
      this.y = (Graphics.boxHeight - this.height) / 2;
  };

  Window_OptionKey.prototype.makeCommandList = function() {
      this.addGeneralOptions();
  };

  Window_OptionKey.prototype.addGeneralOptions = function() {
      this.addCommand(TextManager.keyUp, 'keyUp');
      this.addCommand(TextManager.keyDown, 'keyDown');
      this.addCommand(TextManager.keyLeft, 'keyLeft');
      this.addCommand(TextManager.keyRight, 'keyRight');
      this.addCommand(TextManager.interaction, 'interaction');
  };

  Window_OptionKey.prototype.drawItem = function(index) {
      var rect = this.itemRectForText(index);
      var statusWidth = this.statusWidth();
      var titleWidth = rect.width - statusWidth;
      this.resetTextColor();
      this.changePaintOpacity(this.isCommandEnabled(index));
      this.drawText(this.commandName(index), rect.x, rect.y, titleWidth, 'left');
      this.drawText(this.statusText(index), titleWidth, rect.y, statusWidth, 'right');
  };

  Window_OptionKey.prototype.statusWidth = function() {
      return 120;
  };
  //Вот тут хотел бы остановиться поподробнее
  Window_OptionKey.prototype.statusText = function(index) {
      var result ;
      //С интернета взял всю (почти всю) таблицу соответствия keyCode=keyName
      //Также если посмотрите ниже, я изначально задаю стандартные данные для result
      //Делаю я это для того, чтобы не сбивать пользователя
      //То есть стандартно заданы клавиши вверх вниз влево вправо enter
      //Их оменять нельзя
      //Просто в процессе смены если их можно было бы менять - очень не удобно получалось
      var keycodes = [{"id":8,"name":"Backspace"},{"id":9,"name":"Tab"},{"id":13,"name":"Enter"},{"id":16,"name":"Shift"},{"id":17,"name":"Ctrl"},{"id":18,"name":"Alt"},{"id":19,"name":"Pause/Break"},{"id":20,"name":"Caps Lock"},{"id":27,"name":"Esc"},{"id":33,"name":"Page Up"},{"id":34,"name":"Page Down"},{"id":35,"name":"End"},{"id":36,"name":"Home"},{"id":37,"name":"←"},{"id":38,"name":"↑"},{"id":39,"name":"→"},{"id":40,"name":"↓"},{"id":45,"name":"Insert"},{"id":46,"name":"Delete"},{"id":48,"name":"0"},{"id":49,"name":"1"},{"id":50,"name":"2"},{"id":51,"name":"3"},{"id":52,"name":"4"},{"id":53,"name":"5"},{"id":54,"name":"6"},{"id":55,"name":"7"},{"id":56,"name":"8"},{"id":57,"name":"9"},{"id":65,"name":"A"},{"id":66,"name":"B"},{"id":67,"name":"C"},{"id":68,"name":"D"},{"id":69,"name":"E"},{"id":70,"name":"F"},{"id":71,"name":"G"},{"id":72,"name":"H"},{"id":73,"name":"I"},{"id":74,"name":"J"},{"id":75,"name":"K"},{"id":76,"name":"L"},{"id":77,"name":"M"},{"id":78,"name":"N"},{"id":79,"name":"O"},{"id":80,"name":"P"},{"id":81,"name":"Q"},{"id":82,"name":"R"},{"id":83,"name":"S"},{"id":84,"name":"T"},{"id":85,"name":"U"},{"id":86,"name":"V"},{"id":87,"name":"W"},{"id":88,"name":"X"},{"id":89,"name":"Y"},{"id":90,"name":"Z"},{"id":91,"name":"Left WinKey"},{"id":92,"name":"Right WinKey"},{"id":93,"name":"Select"},{"id":96,"name":"NumPad 0"},{"id":97,"name":"NumPad 1"},{"id":98,"name":"NumPad 2"},{"id":99,"name":"NumPad 3"},{"id":100,"name":"NumPad 4"},{"id":101,"name":"NumPad 5"},{"id":102,"name":"NumPad 6"},{"id":103,"name":"NumPad 7"},{"id":104,"name":"NumPad 8"},{"id":105,"name":"NumPad 9"},{"id":106,"name":"NumPad *"},{"id":107,"name":"NumPad +"},{"id":109,"name":"NumPad -"},{"id":110,"name":"NumPad ."},{"id":111,"name":"NumPad /"},{"id":112,"name":"F1"},{"id":113,"name":"F2"},{"id":114,"name":"F3"},{"id":115,"name":"F4"},{"id":116,"name":"F5"},{"id":117,"name":"F6"},{"id":118,"name":"F7"},{"id":119,"name":"F8"},{"id":120,"name":"F9"},{"id":121,"name":"F10"},{"id":122,"name":"F11"},{"id":123,"name":"F12"},{"id":144,"name":"Num Lock"},{"id":145,"name":"Scroll Lock"},{"id":186,"name":";"},{"id":187,"name":"="},{"id":188,"name":","},{"id":189,"name":"-"},{"id":190,"name":"."},{"id":191,"name":"/"},{"id":192,"name":"`"},{"id":219,"name":"["},{"id":220,"name":"\\"},{"id":221,"name":"]"},{"id":222,"name":"'"}];
      //перечень характеристик в окне представлен как массив строк
      //соответственно индекс- позиция в массиве строки
      if(index === 0){
        //На примере здесь расскажу
        //Задаю стандартное значени - то, что будет отображаться у пользователя
          result = "↑"
          //Забираю все свойства объекта Input.keyMapper массивом и прохожусь по ним
          //keyMapper представляет из себя хеш таблицу индекс:значение
          //keyCode: keyInGameName
          //keyInGameName - стандартные имена клавишь для игры
          //Если ты назавешь клавишу enter up-ом, при нажатии enter персонаж попрет вверх
          //Как назвать клавишу enter up-ом? Очень просто
          //Input.keyMapper[13] = "up"
          //13 - keyCode Enter
          //Так что мы здесь делаем? банально меняем result - отображение
          Object.keys(Input.keyMapper).forEach(function(value, index, array){
            //Ищем какая клавиша назначена на up
              if(Input.keyMapper[value] === "up"){
                //Ищем ее код в массиве keyCode
                  keycodes.forEach(function(val, ind, arr){
                    //Если мы нашли айди и айди не равно клавише вверх (стандартно заданной клавише_)
                      if(+value === val["id"] && val["id"] !== 38){
                        //Пихаем в результ клавишу
                          result = val["name"];
                      }
                  })
              }
          })
          return result;
      }
      //Разберу тут на примере
      //К примеру мы меняли клавишу вниз на S
      //Вниз в массиве характеристик окна 1
      if(index === 1){
        //Задаем стандартно вниз (для первого отоброжения окна)
          result = "↓"
          //Теперь перебираем хештаблицу keyMapper
          Object.keys(Input.keyMapper).forEach(function(value, index, array){
            //Ищем там внутриигровое обозначение down
              if(Input.keyMapper[value] === "down"){
                //допустим нашли
                //теперь ее надо как-то обозвать адекватно
                //ищем код клавиши в массиве keycodes
                  keycodes.forEach(function(val, ind, arr){
                    //Нашли и все такое
                    //Кстати + перед value переводит ее в число
                    //за каким-то хером value тут не число, хотя в самой хештаблице это число
                    //загадка....
                      if(+value === val["id"] && val["id"] !== 40){
                          result = val["name"];
                      }
                  })
              }
          })
          return result;
      }
      if(index === 2){
          result = "←"
          Object.keys(Input.keyMapper).forEach(function(value, index, array){
              if(Input.keyMapper[value] === "left"){
                  keycodes.forEach(function(val, ind, arr){
                      if(+value === val["id"] && val["id"] !== 37){
                          result = val["name"];
                      }
                  })
              }
          })
          return result;
      }
      if(index === 3){
          result = "→"
          Object.keys(Input.keyMapper).forEach(function(value, index, array){
              if(Input.keyMapper[value] === "right"){
                  keycodes.forEach(function(val, ind, arr){
                      if(+value === val["id"] && val["id"] !== 39){
                          result = val["name"];
                      }
                  })
              }
          })
          return result;
      }
      if(index === 4){
          result = "Enter"
          Object.keys(Input.keyMapper).forEach(function(value, index, array){
              if(Input.keyMapper[value] === "ok"){
                  keycodes.forEach(function(val, ind, arr){
                      if(+value === val["id"] && val["id"] !== 13){
                          result = val["name"];
                      }
                  })
              }
          })
          return result;
      }
  };

  //Теперь само окно кейбиндер - окно, где написано "Нажмите клавишу" хехе

  //-----------------------------------------------------------------------------
  // Window_KeyBinder
  //
  // The window for binding key.

  function Window_KeyBinder() {
    this.initialize.apply(this, arguments);
  }

  Window_KeyBinder.prototype = Object.create(Window_Command.prototype);
  Window_KeyBinder.prototype.constructor = Window_KeyBinder;

  Window_KeyBinder.prototype.initialize = function() {
    Window_Command.prototype.initialize.call(this, 0, 0);
    this.updatePlacement();
  };

  Window_KeyBinder.prototype.windowWidth = function() {
    return 400;
  };

  Window_KeyBinder.prototype.windowHeight = function() {
    return this.fittingHeight(Math.min(this.numVisibleRows(), 12));
  };

  Window_KeyBinder.prototype.updatePlacement = function() {
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = (Graphics.boxHeight - this.height) / 2;
  };

  Window_KeyBinder.prototype.makeCommandList = function() {
    this.addGeneralOptions();
  };

  Window_KeyBinder.prototype.addGeneralOptions = function() {
    this.addCommand(TextManager.pressButtonKey, 'pressButtonKey');
  };


  //Дошли до самого интересного, до сцен
  //Сначала надо откорректировать сцену опций под новое окно опций (выше)
  Scene_Options.prototype.createOptionsWindow = function() {
    this._optionsWindow = new Window_Options();
    this._optionsWindow.setHandler('cancel', this.popScene.bind(this));
    this._optionsWindow.setHandler('optionGame',  this.commandOptionGame.bind(this));
    this._optionsWindow.setHandler('optionKeys',  this.commandOptionKey.bind(this));
    this.addWindow(this._optionsWindow);
  };
  Scene_Options.prototype.commandOptionGame = function() {
      this._optionsWindow.close();
      SceneManager.push(Scene_OptionsGame);
  }
  Scene_Options.prototype.commandOptionKey = function() {
      this._optionsWindow.close();
      SceneManager.push(Scene_OptionsKey);
  }


  //Ну, соответственно сцена опции игры
  //-----------------------------------------------------------------------------
  // Scene_OptionsGame
  //
  // The scene class of the options game.

  function Scene_OptionsGame() {
      this.initialize.apply(this, arguments);
  }

  Scene_OptionsGame.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_OptionsGame.prototype.constructor = Scene_OptionsGame;

  Scene_OptionsGame.prototype.initialize = function() {
      Scene_MenuBase.prototype.initialize.call(this);
  };

  Scene_OptionsGame.prototype.create = function() {
      Scene_MenuBase.prototype.create.call(this);
      this.createOptionsWindow();
  };

  Scene_OptionsGame.prototype.terminate = function() {
      Scene_MenuBase.prototype.terminate.call(this);
      ConfigManager.save();
  };

  Scene_OptionsGame.prototype.createOptionsWindow = function() {
      this._optionsWindow = new Window_OptionGame();
      this._optionsWindow.setHandler('cancel', this.popScene.bind(this));
      this.addWindow(this._optionsWindow);
  };


  //Сцена опций клавишь
  //-----------------------------------------------------------------------------
  // Scene_OptionsKey
  //
  // The scene class of the options key.

  function Scene_OptionsKey() {
    this.initialize.apply(this, arguments);
  }

  Scene_OptionsKey.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_OptionsKey.prototype.constructor = Scene_OptionsKey;

  Scene_OptionsKey.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
  };

  Scene_OptionsKey.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createOptionsWindow();
  };

  Scene_OptionsKey.prototype.terminate = function() {
    Scene_MenuBase.prototype.terminate.call(this);
    ConfigManager.save();
  };

  Scene_OptionsKey.prototype.createOptionsWindow = function() {
    this._optionsWindow = new Window_OptionKey();
    this._optionsWindow.setHandler('cancel', this.popScene.bind(this));
    this._optionsWindow.setHandler('keyUp',  this.commandOptionKeyUp.bind(this));
    this._optionsWindow.setHandler('keyDown',  this.commandOptionKeyDown.bind(this));
    this._optionsWindow.setHandler('keyLeft',  this.commandOptionKeyLeft.bind(this));
    this._optionsWindow.setHandler('keyRight',  this.commandOptionKeyRight.bind(this));
    this._optionsWindow.setHandler('interaction',  this.commandOptionKeyInt.bind(this));
    this.addWindow(this._optionsWindow);
  };
  Scene_OptionsKey.prototype.commandOptionKeyUp = function() {
    this._optionsWindow.close();
    SceneManager.push(Scene_KeyBinderKeyUp);
  }
  Scene_OptionsKey.prototype.commandOptionKeyDown = function() {
    this._optionsWindow.close();
    SceneManager.push(Scene_KeyBinderKeyDown);
  }
  Scene_OptionsKey.prototype.commandOptionKeyLeft = function() {
    this._optionsWindow.close();
    SceneManager.push(Scene_KeyBinderKeyLeft);
  }
  Scene_OptionsKey.prototype.commandOptionKeyRight = function() {
    this._optionsWindow.close();
    SceneManager.push(Scene_KeyBinderKeyRight);
  }
  Scene_OptionsKey.prototype.commandOptionKeyInt = function() {
    this._optionsWindow.close();
    SceneManager.push(Scene_KeyBinderKeyInt);
  }


  //Далее сцены опций клавишь каждой отдельной клавиши
  //-----------------------------------------------------------------------------
  // Scene_KeyBinderKey******
  //
  // The scene class of the options Spec key.
  //=================================================

  function Scene_KeyBinderKeyUp() {
    this.initialize.apply(this, arguments);
  }

  Scene_KeyBinderKeyUp.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_KeyBinderKeyUp.prototype.constructor = Scene_KeyBinderKeyUp;

  Scene_KeyBinderKeyUp.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
  };

  Scene_KeyBinderKeyUp.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createOptionsWindow();
    this.makeKey();
  };

  Scene_KeyBinderKeyUp.prototype.terminate = function() {
    Scene_MenuBase.prototype.terminate.call(this);
    ConfigManager.save();
  };

  Scene_KeyBinderKeyUp.prototype.createOptionsWindow = function() {
    this._optionsWindow = new Window_KeyBinder();
    this._optionsWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._optionsWindow);
  };

  Scene_KeyBinderKeyUp.prototype.makeKey = function() {  
    if(SceneManager._scene.constructor.name === "Scene_KeyBinderKeyUp"){
        document.addEventListener('keyup', this.keyCheck);
    }
  };
  Scene_KeyBinderKeyUp.prototype.keyCheck = function(event){
    var okButton = Object.keys(Input.keyMapper).forEach(function(value, index, array){
      if(Input.keyMapper[value] === "ok" && +value !== 13){
          return value;
      }
      });
      console.log(okButton);
    if(event.keyCode !== 13 && event.keyCode !== 37 && event.keyCode !== 38 && event.keyCode !== 39 && event.keyCode !== 40){
        //Сперва надо убрать все клавиши с этим назначением
        Object.keys(Input.keyMapper).forEach(function(value, index, array){
            if(Input.keyMapper[value] === "up" && +value !== 38){
                Input.keyMapper[value] = "";
            }
        })
        Input.keyMapper[event.keyCode] = "up";
        document.removeEventListener('keyup', Scene_KeyBinderKeyUp.prototype.keyCheck);
        Input._setupEventHandlers();
        SceneManager._scene._optionsWindow.callHandler('cancel');
    }
  }
  //=======================================

  function Scene_KeyBinderKeyDown() {
    this.initialize.apply(this, arguments);
  }

  Scene_KeyBinderKeyDown.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_KeyBinderKeyDown.prototype.constructor = Scene_KeyBinderKeyDown;

  Scene_KeyBinderKeyDown.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
  };

  Scene_KeyBinderKeyDown.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createOptionsWindow();
    this.makeKey();
  };

  Scene_KeyBinderKeyDown.prototype.terminate = function() {
    Scene_MenuBase.prototype.terminate.call(this);
    ConfigManager.save();
  };

  Scene_KeyBinderKeyDown.prototype.createOptionsWindow = function() {
    this._optionsWindow = new Window_KeyBinder();
    this._optionsWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._optionsWindow);
  };

  Scene_KeyBinderKeyDown.prototype.makeKey = function() {  
    if(SceneManager._scene.constructor.name === "Scene_KeyBinderKeyDown"){
        document.addEventListener('keyup', this.keyCheck);
    }
  };
  Scene_KeyBinderKeyDown.prototype.keyCheck = function(event){
    var okButton = Object.keys(Input.keyMapper).forEach(function(value, index, array){
      if(Input.keyMapper[value] === "ok" && +value !== 13){
          return value;
      }
      });
    if(event.keyCode !== 13 && event.keyCode !== 37 && event.keyCode !== 38 && event.keyCode !== 39 && event.keyCode !== 40 && event.keyCode !== +okButton){
        //Сперва надо убрать все клавиши с этим назначением
        Object.keys(Input.keyMapper).forEach(function(value, index, array){
            if(Input.keyMapper[value] === "down" && +value !== 40){
                Input.keyMapper[value] = "";
            }
        })
        Input.keyMapper[event.keyCode] = "down";
        document.removeEventListener('keyup', Scene_KeyBinderKeyDown.prototype.keyCheck);
        Input._setupEventHandlers();
        SceneManager._scene._optionsWindow.callHandler('cancel');
    }
  }
  //=======================================

  function Scene_KeyBinderKeyLeft() {
    this.initialize.apply(this, arguments);
  }

  Scene_KeyBinderKeyLeft.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_KeyBinderKeyLeft.prototype.constructor = Scene_KeyBinderKeyLeft;

  Scene_KeyBinderKeyLeft.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
  };

  Scene_KeyBinderKeyLeft.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createOptionsWindow();
    this.makeKey();
  };

  Scene_KeyBinderKeyLeft.prototype.terminate = function() {
    Scene_MenuBase.prototype.terminate.call(this);
    ConfigManager.save();
  };

  Scene_KeyBinderKeyLeft.prototype.createOptionsWindow = function() {
    this._optionsWindow = new Window_KeyBinder();
    this._optionsWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._optionsWindow);
  };

  Scene_KeyBinderKeyLeft.prototype.makeKey = function() {  
    if(SceneManager._scene.constructor.name === "Scene_KeyBinderKeyLeft"){
        document.addEventListener('keyup', this.keyCheck);
    }
  };
  Scene_KeyBinderKeyLeft.prototype.keyCheck = function(event){
    var okButton = Object.keys(Input.keyMapper).forEach(function(value, index, array){
      if(Input.keyMapper[value] === "ok" && +value !== 13){
          return value;
      }
      });
    if(event.keyCode !== 13 && event.keyCode !== 37 && event.keyCode !== 38 && event.keyCode !== 39 && event.keyCode !== 40 && event.keyCode !== +okButton){
        //Сперва надо убрать все клавиши с этим назначением
        Object.keys(Input.keyMapper).forEach(function(value, index, array){
            if(Input.keyMapper[value] === "left" && +value !== 37){
                Input.keyMapper[value] = "";
            }
        })
        Input.keyMapper[event.keyCode] = "left";
        document.removeEventListener('keyup', Scene_KeyBinderKeyLeft.prototype.keyCheck);
        Input._setupEventHandlers();
        SceneManager._scene._optionsWindow.callHandler('cancel');
    }
  }
  //=======================================

  function Scene_KeyBinderKeyRight() {
    this.initialize.apply(this, arguments);
  }

  Scene_KeyBinderKeyRight.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_KeyBinderKeyRight.prototype.constructor = Scene_KeyBinderKeyRight;

  Scene_KeyBinderKeyRight.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
  };

  Scene_KeyBinderKeyRight.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createOptionsWindow();
    this.makeKey();
  };

  Scene_KeyBinderKeyRight.prototype.terminate = function() {
    Scene_MenuBase.prototype.terminate.call(this);
    ConfigManager.save();
  };

  Scene_KeyBinderKeyRight.prototype.createOptionsWindow = function() {
    this._optionsWindow = new Window_KeyBinder();
    this._optionsWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._optionsWindow);
  };

  Scene_KeyBinderKeyRight.prototype.makeKey = function() {  
    if(SceneManager._scene.constructor.name === "Scene_KeyBinderKeyRight"){
        document.addEventListener('keyup', this.keyCheck);
    }
  };
  Scene_KeyBinderKeyRight.prototype.keyCheck = function(event){
    var okButton = Object.keys(Input.keyMapper).forEach(function(value, index, array){
      if(Input.keyMapper[value] === "ok" && +value !== 13){
          return value;
      }
      });
    if(event.keyCode !== 13 && event.keyCode !== 37 && event.keyCode !== 38 && event.keyCode !== 39 && event.keyCode !== 40 && event.keyCode !== +okButton){
        //Сперва надо убрать все клавиши с этим назначением
        Object.keys(Input.keyMapper).forEach(function(value, index, array){
            if(Input.keyMapper[value] === "right"  && +value !== 39){
                Input.keyMapper[value] = "";
            }
        })
        Input.keyMapper[event.keyCode] = "right";
        document.removeEventListener('keyup', Scene_KeyBinderKeyRight.prototype.keyCheck);
        Input._setupEventHandlers();
        SceneManager._scene._optionsWindow.callHandler('cancel');
    }
  }
  //=======================================

  function Scene_KeyBinderKeyInt() {
    this.initialize.apply(this, arguments);
  }

  Scene_KeyBinderKeyInt.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_KeyBinderKeyInt.prototype.constructor = Scene_KeyBinderKeyInt;

  Scene_KeyBinderKeyInt.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
  };

  Scene_KeyBinderKeyInt.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createOptionsWindow();
    this.makeKey();
  };

  Scene_KeyBinderKeyInt.prototype.terminate = function() {
    Scene_MenuBase.prototype.terminate.call(this);
    ConfigManager.save();
  };

  Scene_KeyBinderKeyInt.prototype.createOptionsWindow = function() {
    this._optionsWindow = new Window_KeyBinder();
    this._optionsWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._optionsWindow);
  };

  Scene_KeyBinderKeyInt.prototype.makeKey = function() {  
    if(SceneManager._scene.constructor.name === "Scene_KeyBinderKeyInt"){
        document.addEventListener('keyup', this.keyCheck);
    }
  };
  Scene_KeyBinderKeyInt.prototype.keyCheck = function(event){
    var okButton = Object.keys(Input.keyMapper).forEach(function(value, index, array){
    if(Input.keyMapper[value] === "ok" && +value !== 13){
        return value;
    }
    });
    console.log(okButton);
    if(event.keyCode !== 13 && event.keyCode !== 37 && event.keyCode !== 38 && event.keyCode !== 39 && event.keyCode !== 40 && event.keyCode !== +okButton){
        //Сперва надо убрать все клавиши с этим назначением
        Object.keys(Input.keyMapper).forEach(function(value, index, array){
            if(Input.keyMapper[value] === "ok" && +value !== 13){
                Input.keyMapper[value] = "";
            }
        })
        Input.keyMapper[event.keyCode] = "ok";
        document.removeEventListener('keyup', Scene_KeyBinderKeyInt.prototype.keyCheck);
        Input._setupEventHandlers();
        SceneManager._scene._optionsWindow.callHandler('cancel');
    }
  }

  //И на последок надо убрать из Input.keyMapper лишние клавиши
  //Там много говна с numPad
  //Если нужен NumPad пускай юзер сам их ставит
  Input.keyMapper[18] = "";
  Input.keyMapper[45] = "";
  Input.keyMapper[81] = "";
  Input.keyMapper[87] = "";
  Input.keyMapper[88] = "";
  Input.keyMapper[90] = "";
  Input.keyMapper[96] = "";
  Input.keyMapper[98] = "";
  Input.keyMapper[100] = "";
  Input.keyMapper[102] = "";
  Input.keyMapper[104] = "";
})();