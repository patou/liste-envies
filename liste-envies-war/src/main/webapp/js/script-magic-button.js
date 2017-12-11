/**
 * Created by Patrice on 11/12/2017.
 */
(function (window, width, height) {
    var dualScreenLeft = window.screenLeft || screen.left;
    var dualScreenTop = window.screenTop || screen.top;
    var width = window.innerWidth || document.documentElement.clientWidth || screen.width;
    var height = window.innerHeight || document.documentElement.clientHeight || screen.height;
    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;
    window.open('http://{{main.host}}/#/addWish/?url=' + encodeURIComponent(document.location.href) + '&title=' + encodeURIComponent(document.title), 'Ajouter sur votre liste d\'envie', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=no,width=' + width + ',height=' + height + ',top=' + top + ',left=' + left).focus();
}(window, 500, 700));
/**
Pour générer la version minifié :
 https://skalman.github.io/UglifyJS-online/
 Dans options, modifier output/quote_style: 1,
 */