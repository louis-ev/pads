
document.old_write = document.write;

// intercept hackpad write
document.write = function (str) {

  // replace <undefined><li> with <h3> and </li></undefined> with </h3>
  str = str
    .replace(/<undefined><li>/g, '<h3>')
    .replace(/<\/li><\/undefined>/g, '</h3>')
    .replace(/&rsquo;/g, '\'')
    .replace(/--&gt;/g, '→')
    ;

  document.old_write(str);
  var $container = $("#content");
  $container.find('a').each(function() {
    var href = $(this).attr('href');

    var codependIframe = makeCodepenIframeFromLink(href);
    if(codependIframe) {
      $(this).parent().html(codependIframe);
      return;
    }

    var youtubeIframe = makeYoutubeIframeFromLink(href);
    if(youtubeIframe) {
      $(this).parent().html(youtubeIframe);
      return;
    }

    var vimeoIframe = makeVimeoIframeFromLink(href);
    if(vimeoIframe) {
      $(this).parent().html(vimeoIframe);
      return;
    }
  });

  $container.find('img').each(function() {
    // wrap all images in links and target blank
    var imgUrl = $(this).attr('src');
    $(this).wrap('<a href="' + imgUrl  + '" target="_blank">');
  });

  $container.waitForImages(function() {
    console.log('All images have loaded');
    $container.scrollNav({
      sections: 'h2',
      subSections: 'h3',
      sectionElem: 'section',
      showHeadline: true,
      headlineText: 'Navigation',
      showTopLink: true,
      topLinkText: $container.find('h1').text(),
      fixedMargin: 20,
      scrollOffset: 20,
      animated: true,
      speed: 500,
      insertTarget: this.selector,
      insertLocation: 'insertBefore',
      arrowKeys: false,
      scrollToHash: true,
      onInit: null,
      onRender: null,
      onDestroy: null
    });
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
  return '<div class="iframeContainer"><iframe src="' + href + '?height=512&theme-id=0&default-tab=html,result&embed-version=2" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" ></iframe></div>';
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

function makeVimeoIframeFromLink(href) {
  function getId(url) {
    if(url.indexOf('vimeo.com/') >= 0) {
      return url.substr(url.lastIndexOf('/') + 1);
    } else {
      return 'error';
    }
  }
  var myId = getId(href);
  if(myId === 'error')
    return false;
  return '<div class="iframeContainer"><iframe src="https://player.vimeo.com/video/' + myId + '" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>';
}

$("document").ready( function() {

});