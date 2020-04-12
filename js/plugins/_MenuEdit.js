//=============================================================================
// _MenuEdit.js
//=============================================================================

/*:
 * @plugindesc Menu edit plugin.
 * @author Antamansid for ScarletProject
 *
 * @help This plugin does not provide plugin commands.
 */

(function() {
    //Сначала сделаем копию на изначальный объект, чтобы перед редактированием запустить стандартный код
    var _Window_Selectable_prototype_processCursorMove = Window_Selectable.prototype.processCursorMove;
    //Теперь редактируем стандартный код
    Window_Selectable.prototype.processCursorMove = function() {
      //Запускаем стандартный скопированный код (смотри строчку 15)
        _Window_Selectable_prototype_processCursorMove.call(this);
        //нам нужно, чтобы обработка событий происходила только в сцене меню. Это Scene_Title
        if(SceneManager._scene.constructor.name === "Scene_Title"){
        //Обрабатываем событие "мышь двигалась"
            if (this.isCursorMovable()) {
            //Проверяем какие нажаты клавиши
            //Если нажата клавиша вниз
                if (Input.isRepeated('down')) {
                //Добавляем спрайт изображения на нулевую позицию
                SceneManager._scene.addChildAt(new Sprite(ImageManager.loadTitle1("Book")), 0);
                //Когда мы добавляем новый спрайт на нулевую позицию, старый нулевой спрайт становится 1ым
                //Удаляем его
                SceneManager._scene.removeChildAt (1);
                }
                //Если нажата клавиша вверх
                if (Input.isRepeated('up')) {
                //Добавляем спрайт изображения на нулевую позицию
                SceneManager._scene.addChildAt(new Sprite(ImageManager.loadTitle1("Castle")), 0);
                //Когда мы добавляем новый спрайт на нулевую позицию, старый нулевой спрайт становится 1ым
                //Удаляем его
                SceneManager._scene.removeChildAt (1);
                }
            }
        }
    };
  })();