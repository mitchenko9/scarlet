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
  var _Window_Selectable_prototype_processCursorMove = Window_Selectable.prototype.processCursorMove;
  Window_Selectable.prototype.processCursorMove = function() {
      _Window_Selectable_prototype_processCursorMove.call(this);
      if (this.isCursorMovable()) {
          if (Input.isRepeated('down')) {
              if(SceneManager._scene.constructor.name === "Scene_Title"){
                  SceneManager._scene.addChildAt(new Sprite(ImageManager.loadTitle1("Book")), 0);
                  SceneManager._scene.removeChildAt (1);
              }
          }
          if (Input.isRepeated('up')) {
              if(SceneManager._scene.constructor.name === "Scene_Title"){
                  SceneManager._scene.addChildAt(new Sprite(ImageManager.loadTitle1("Castle")), 0);
                  SceneManager._scene.removeChildAt (1);
              }
          }
      }
  };
})();