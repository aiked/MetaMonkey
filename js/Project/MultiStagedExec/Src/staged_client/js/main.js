
(function(){

  var SERVER_URL = "http://139.91.96.84:8086";

  var demosSrc, srcEditor;

  function composeId(idx, type) {
  	return 'sjs_js__uniqId-' + idx + '-' + type;
  }

  function toggleLoading(isLoading) {
    $('.sjs_js__editor-header-item').prop('disabled', isLoading);
    if(isLoading) {
      $('.sjs_js__editor-header-loading').show();
    }else {
      $('.sjs_js__editor-header-loading').hide();
    }
  }

  function ShowErrorMsg(msg) {
    var errorMsgHtmlTmpl = _.template($('#sjs_js__errorMsgTmpl').text());
    if(msg.code===201) {
      msg.code = 'Reflect parse error';
      msg.desc = 'Syntax error';
    }
    var errormsgHtml = $( errorMsgHtmlTmpl(msg) );
    $('.sjs_js__sourceEditorWrapper').prepend(errormsgHtml);
    _.delay(function(){
      errormsgHtml.remove();
    }, 5000);
  }

  function genSrcEditor(id, val) {
    var editor = ace.edit(id);
    editor.$blockScrolling = Infinity;
    var editorSession = editor.getSession();
    editorSession.setUseWorker(false);
    editorSession.setUseWrapMode(true);
    editorSession.setMode("ace/mode/javascript");
    editor.setTheme("ace/theme/monokai");
    if(val) {
      srcEditorSetValue(editor, val);
    }
    editor.onScrollTopChange(function(evt){
      console.log(evt);
    });
    return editor;
  }

  function srcEditorSetValue(editor, val) {
    editor.setValue(val);
    editor.gotoLine(1);
  }

  function closeResultsView() {
    $('.sjs_js__editor').addClass('sjs_is__editor-onlySrc');
    $('.sjs_js__resultEditors').empty();
  }

  function animatedCloseResultsView() {
    $('.sjs_js__resultEditors').slideUp(400, function(){
      closeResultsView();
    });
  }

  function genResultsView(results) {
  	var resultsHtmlTmpl = _.template($('#sjs_js__resultEditorTmpl').text());
  	var resultsHtml = $(resultsHtmlTmpl({
  		composeId: composeId,
  		results: results
  	}));

  	$('.sjs_js__resultEditors').append(resultsHtml);

  	resultsHtml.find('a').click(function (e) {
  	  e.preventDefault();
  	  $(this).tab('show');
  	});
    resultsHtml.find('a').last().click();

  	_.each(results, function(result, idx) {
      var currExecId = composeId(idx, 'exec');
      var currResId = composeId(idx, 'result');
  		genSrcEditor("sjs_js__resultEditor-ID"+currExecId, unescape(result.exec));
      genSrcEditor("sjs_js__resultEditor-ID"+currResId, unescape(result.result));
  	});

    $('.sjs_js__resultEditors').hide();
    $('.sjs_js__editor').removeClass('sjs_is__editor-onlySrc');
    $('.sjs_js__resultEditors').slideDown(400);
  }

  function genDemoChooser() {
    var resultsHtmlTmpl = _.template($('#sjs_js__demoChooserTmpl').text());
    var resultsHtml = $(resultsHtmlTmpl({
      demosSrc: demosSrc
    }));
    $('.sjs_js__editor-header-demoChooser').append(resultsHtml);
  }

  function selectDemo(idx) {
    animatedCloseResultsView();
    var targetIdxSel = $('.sjs_js__demoChooser-idx');
    var targetIdx = +targetIdxSel.attr('target-idx');
    if(idx!==targetIdx) {
      var selectedIdxSel = $('.sjs_js__editor-header-demoChooser [target-idx="' + idx + '"]');
      selectedIdxSel.attr('target-idx', targetIdx);
      selectedIdxSel.text(demosSrc[targetIdx].name);

      targetIdxSel.attr('target-idx', idx);
      targetIdxSel.find('.sjs_js__demoChooser-name').text(demosSrc[idx].name);
    }
    srcEditorSetValue(srcEditor, demosSrc[idx].src);
  }

  function compileSrc() {
    toggleLoading(true);
    var src = srcEditor.getValue();
    src = escape(src);
    
    $.get( SERVER_URL + "/eval?src=" + src ).done(function(resp) {
      if(resp.success) {
        closeResultsView();
        genResultsView(resp.msg);
      }else {
        ShowErrorMsg(resp.msg);
      }
      toggleLoading(false);
    }).fail(function(){}).always(function(){});
  }

  $(document).ready(function(){
    demosSrc = [];
    $('.sjs_js__demoSrc').each(function() {
      var demo = $(this);
      demosSrc.push({
        name: demo.attr('demo-name'),
        src: demo.text()
      });
    });

    var editSel = $('.sjs_js__editorWrapper');
    var bodySel = $('body');
    $('.sjs_f__editor-col').mouseover(function(){
      bodySel.css('overflow', 'hidden');
      editSel.addClass('sjs_is__editor-active');
    });
    $('.sjs_f__editor-col').mouseout(function(){
      bodySel.css('overflow', 'auto');
      editSel.removeClass('sjs_is__editor-active');
    });

    $('.dropdown-toggle').dropdown();
    genDemoChooser();

		srcEditor = genSrcEditor("sjs_js__sourceEditor");
    selectDemo(0);
    closeResultsView();
    $('.sjs_js__editor-header-compileBtn').click(compileSrc);
    $('.sjs_js__editor-header-closeBtn').click(animatedCloseResultsView);

    $('.sjs_js__editor-header-demoChooser .dropdown-menu [target-idx]').click(function() {
      var targetIdx = +$(this).attr('target-idx');
      selectDemo(targetIdx);
    });
  });

})();

