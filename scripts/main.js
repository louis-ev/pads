document.old_write = document.write;

// intercept hackpad write
document.write = function (str) {
  // replace <undefined><li> with <h3> and </li></undefined> with </h3>
  str = str
    .replace(/<undefined><li>/g, '<h3>')
    .replace(/<\/li><\/undefined>/g, '</h3>')
    .replace(/&rsquo;/g, '\'')
    ;

  var container = document.getElementById("content");
  document.old_write(str);

  $(container).find('a').each(function() {
    var href = $(this).attr('href');

    var codependIframe = makeCodepenIframeFromLink(href);
    if(codependIframe) {
      $(this).parent().html(codependIframe);
    }

    var youtubeIframe = makeYoutubeIframeFromLink(href);
    if(youtubeIframe) {
      $(this).parent().html(youtubeIframe);
    }
  });
//   $(container).find('p:empty').html('<br>');
};


function makeCodepenIframeFromLink(href) {

  if(href.indexOf('codepen.io/') === -1)
    return false;

  // convert pen to embed
  if(href.indexOf('/pen/') > 0) {
    href = href.replace(/\/pen\//g, '/embed/');
  }

  if(href.indexOf('/embed/') === -1)
    return false;

  return '<div class="iframeContainer"><iframe src="' + href + '"></iframe></div>';
}

function makeYoutubeIframeFromLink(href) {
  function getId(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) {
      return match[2];
    } else {
      return 'error';
    }
  }
  var myId = getId(href);
  if(myId === 'error')
    return false;
  return '<div class="iframeContainer"><iframe width="560" height="315" src="//www.youtube.com/embed/' + myId + '" frameborder="0" allowfullscreen></iframe></div>';
}


$("document").ready( function() {

	$(".colonne").each( function(i) {

		var $this = $(this);

		$this.prepend( '<div class="edit"><img src="./img/edit.png" class="" width="32" height="32" /></div>');

		/*****************************************************
			lien en couleur, team name
		******************************************************/

		$this.find("a").css("color", thisCouleur );
		var indexEquipe = $this.text().indexOf("<équipe=");
		if( indexEquipe >= 0 ) {
			thisEquipe = $this.text().substring( indexEquipe );
			thisEquipe = thisEquipe.substring( 8, thisEquipe.indexOf(">") );
			console.log( "thisEquipe : " +  thisEquipe );

			$this.attr("data-team", thisEquipe );
			$this.css("borderColor", thisCouleur );

		}

		/*****************************************************
			changer l'ordre
		******************************************************/

		var indexOrdre = $this.text().indexOf("<ordre=");
		if( indexOrdre >= 0 ) {
			thisOrdre = $this.text().substring( indexOrdre );
			thisOrdre = thisOrdre.substring( 7, thisOrdre.indexOf(">") );
			console.log( "thisOrdre : " +  thisOrdre );

			$this.css("-webkit-order", thisOrdre );
			$this.css("-moz-order", thisOrdre );
			$this.css("order", thisOrdre );

		}

		/*****************************************************
			code-folding
		******************************************************/

		function makeCodeFold( thisColonne, thisHtml ) {

			thisColonne.html(function(index,html){
			    return html.replace(/<p>{<\/p>/g, "<div class='textFold is-folded'>");
			});
			thisColonne.html(function(index,html){
			    return html.replace(/<p>}<\/p>/g, "</div>");
			});

			thisColonne.find(".textFold").css("borderColor", thisCouleur );

		}
		makeCodeFold( $this, $this.html() );

		/*****************************************************
			masquer les-dits paramètres
		******************************************************/

		$this.find("p").each(function() {
			var parameters = $(this).find("i");
			if ( parameters.length > 0 ) {
				parameters.hide();
			} else {
				return false;
			}
		});

		/*****************************************************
			URL : membres d'équipe
		******************************************************/


		if ( teamMember !== '' && teamMember !== undefined ) {
			if ( indexEquipe >= 0 ) {
				var members = $this.attr("data-team").split(',');
		    for (var i = 0; i < members.length; i++) {
					if( members[i].trim().toLowerCase() === teamMember.toLowerCase() ) {
						$this.removeClass("is-hidden");
					}
				}
			}
		} else {
			setTimeout( function() {
				$this.removeClass("is-hidden");
			}, 100);
		}


		$this.find("h1").click( function() {
			$this.toggleClass("is-larger");
		});
		$this.find(".textFold *:first-child").on("click",function() {
			$(this).parent(".textFold").toggleClass("is-folded");
		});

		console.log("-----");

	});

	/*****************************************************
		créé le topmenu de navigation vers les pads
	******************************************************/

	createTopNav();

	$(".tooltip .button").on("click", function(e) {
		$(".tooltip").toggleClass("is-closed");
	});

/*
	$('body').scrollTo(
		$(".tableau-cont[data-wwhww=what]"),
		{ offset: { top: -$("#viewport").height()/2 + 300, left: -$("#viewport").width()/2 + 400} },
		{ easing: 'easeInOutQuint' }
	);
*/

	$(".colonneContainer").wrap( "<div id='colonneViewport'></div>" );
	$('#colonneViewport').find(".colonneContainer").addClass("dragger");
	//$(".colonneContainer").find(".colonne").addClass("dragger");
	$(".colonne").wrapInner( "<div class='colonneContent dragger'></div>" );
/*
	$('.colonne').dragscrollable({
		dragSelector: '.dragger',
		acceptPropagatedEvent: false
	});
*/

	$(".colonne .edit").on("click", function(e) {

		$that = $(this).closest(".colonne");

		if ( !$that.hasClass("is-editable") ) {

			var thisScriptSrc = $that.find("script").eq(0).attr("src");

			var thisScriptID = thisScriptSrc.substring( thisScriptSrc.lastIndexOf("\/") + 1, thisScriptSrc.indexOf(".js") );
			var workspaceLocation = thisScriptSrc.substring( 0, thisScriptSrc.lastIndexOf("\/") );

			$thisEdit = $that.find(".edit");
			$thisEdit.nextAll().remove()
			$thisEdit.after('<iframe id="hackpad-' + thisScriptID + '" src="' + workspaceLocation + '/ep/api/embed-pad?padId=' + thisScriptID + '" style="border:0px;width:100%;height:100%;"></iframe>');

			$that.addClass( "is-editable" );

			window.addEventListener("message", function(event) {
				//console.log(event);
				if (event.origin == workspaceLocation) {
					var args = event.data.split(":");
					if (args.length < 3 || args[0] != "hackpad-" + thisScriptID || args[1] != "height") {
						return;
					}
					var height = Number(args[2]) + 60; // 60 is non-ace elements offset
					var hp = document.getElementById("hackpad-" + thisScriptID );
					if (hp && height > 420) {
						hp.style.height = height + "px";
					}
				}
			}, false);

		}

		else {

/*
				var thisScript = $this.find("iframe").eq(0).attr("id").substring( 8 );
				console.log("thisScript : " + thisScript );

				$this.html('<iframe src="https://socmed2.hackpad.com/' + thisScript + '.js?format=html" sandbox="allow-same-origin allow-scripts"><div></div></iframe>');
*/

//				$this.removeClass( "is-editable" );

			window.location.reload();

		}
		});

});
function createTopNav() {
	var titreProche = function(modwscrollTop) {
		var dist = 0;
		var pDist = 10000000000;
		var titreactif;
		//optimisation : stocker le numéro d'article plutôt que l'article : http://jsperf.com/jquery-each-this-vs-eq-index
		var numTitre = -1;
		var $titres = $('.colonneContainer h1');
		$titres.each(function(index) {
			dist = modwscrollTop - this.offsetTop;
			if (dist > 0 && dist < pDist) {
				pDist = dist;
				numTitre = index;
			}
		});
		if ( numTitre !== -1 ) {
			titreactif = $titres.eq(numTitre);
			return titreactif;
		}
		return false;
	};

	var gotoByScroll = function(section, margintop, callback) {
		if ($(window).width() >= 992) {
			var offsetLeftPx = section.position().left;
			$('#colonneViewport').animate({
				scrollLeft: offsetLeftPx
			}, 600, 'easeInOutQuint', callback );
		} else {
			$('#colonneViewport').animate({
				scrollLeft: offsetLeftPx
			}, 0, callback );
		}
	};

	function hyphenate(str) {
		return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	}

	$.extend($.easing, {
		easeInOutQuint: function(x, t, b, c, d) {
			if ((t /= d / 2) < 1) { return c / 2 * t * t * t * t * t + b; }
			return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
		}
	});

	if ( $('.colonneContainer h1').length !== 0) {
		var counter = 0;
		$('body').prepend("<nav id='asideTop'><div class='wrap'><ul><h4 class='toc'>Liste de pads</h4></ul></div></nav>");
		$('body').addClass("sidenav");

		var lienH = $(".lienHackpad").remove();
		$("#asideTop").prepend(lienH);

		$('.colonneContainer h1').each(function() {

			var $this = $(this);
			var $thisCol = $this.closest(".colonne");
			var title = $this.first().text();
			var id = $this.attr('id');
			if (!id) {
				id = hyphenate(title).replace(/\s+/g, '-').replace(/éè/g, 'e').replace(/^#/, '').replace(/[!"#$%&'*+,.\/:;<=>?@\[\\\]\^_`{|}~]+/g, '-').replace(/-+/g, '-');
				$(this).attr('id', id);
			}

			$(this).attr('id', id);

			var selector = $('<li class="entry items ' + id + '"><a href="#' + id + '" data-goto="' + id + '">' + title + '</a></li>').appendTo($('#asideTop ul'));

			//console.log("well " + $(this));

			var colCouleur = $this.closest(".colonne").find(".edit").css("background-color");

			selector.css("background-color", colCouleur );

			$(selector).click(function(e) {
				e.preventDefault();
				console.log("this ");
				console.log($this);
				var slideto = $(this).find('a').attr("data-goto");
				$('#asideTop li').removeClass("active");
				$(this).addClass("active");
				console.log("slideto : " + slideto);
				gotoByScroll( $thisCol , 40, function () {
					//window.location.hash = '#' + slideto;
				});
			});
		});

		var titreVu = titreProche(window.pageYOffset);

		$(window).scroll(function() {
			var posScrollPage = window.pageYOffset;
			var newTitreVu = titreProche(posScrollPage);


			if ( newTitreVu !== false && !$("html,body").is(':animated') ) {
				if ( !newTitreVu.hasClass("active") ) {
					if (titreVu !== false) {
						titreVu.removeClass("active");
					}
					newTitreVu.addClass("active");

					$('#aside-right li').removeClass("active");
					var lienNav = $('#aside-right a').filter(function() {
						return $(this).attr('data-goto') === newTitreVu.attr("id");
					});
					lienNav.parent("li").addClass("active");


					titreVu = newTitreVu;
				}
			}
		});
	}
}