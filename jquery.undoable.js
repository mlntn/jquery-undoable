/*
 * 
 * $.undoable()
 *
 * Copyright (c) 2009 Jared Mellentine - jared(at)mlntn(dot)com | http://mlntn.com
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * Date: 3/9/2009
 * 
 */

(function($){
	$.fn.undoable = function(redo) {
		var undo = (typeof arguments[1] == 'function') ? arguments[1] : redo;
		redo();
		var uf = $('body').data('undoFunctions');		
		if (typeof uf == 'object') uf.push([redo,undo]); else uf = [[redo,undo]];
		if ($('body').data('undoEnabled') !== true) $().enableUndo();
		$('body').data('undoFunctions', uf);
		$('body').data('redoFunctions', []); // reset the redo queue
	};

	$.fn.enableUndo = function(params){
		var defaults = {
			undoCtrlChar : 'z',
			redoCtrlChar : 'z',
			redoShiftReq : true
		};
		var settings = $.extend(defaults, params);
		var undoChar = settings.undoCtrlChar.toUpperCase().charCodeAt();
		var redoChar = settings.redoCtrlChar.toUpperCase().charCodeAt();
		
		$(document).keydown(function(e){
			// UNDO
			if (e.ctrlKey && !e.shiftKey && e.which == undoChar) {
				var uf = $('body').data('undoFunctions');
				if (typeof uf == 'object') {
					var lf = uf.pop();
					$('body').data('undoFunctions', uf);

					if (lf) {
						var rf = $('body').data('redoFunctions');
						if (rf) rf.push(lf); else rf = [lf];
						$('body').data('redoFunctions', rf);

						lf[1](); // undo is index 1
					}
				}
			}
			// REDO
			if (e.ctrlKey && (e.shiftKey || !settings.redoShiftReq) && e.which == redoChar) {
				var rf = $('body').data('redoFunctions');
				if (typeof rf == 'object') {
					var lf = rf.pop();
					$('body').data('redoFunctions', rf);

					if (lf) {
						var uf = $('body').data('undoFunctions');
						if (uf) uf.push(lf); else uf = [lf];
						$('body').data('undoFunctions', uf);

						lf[0](); // redo is index 0
					}
				}
			}
		});
		$('body').data('undoEnabled', true);
	};
})(jQuery);
